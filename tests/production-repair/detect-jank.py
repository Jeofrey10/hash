import cv2
import numpy as np

video_path = "C:/Users/KANIMOZHI/.gemini/antigravity/brain/724fa76e-f8f7-41ea-be9a-6c59763484a4/.user_uploaded/media_1794608920489_553d5807.mp4"
cap = cv2.VideoCapture(video_path)
fps = cap.get(cv2.CAP_PROP_FPS)

prev_gray = None
frozen_frame_count = 0
jank_events = []
frame_diffs = []

frame_idx = 0
current_frozen_streak = 0

while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break
    
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    if prev_gray is not None:
        diff = np.mean(cv2.absdiff(gray, prev_gray))
        frame_diffs.append(diff)
        
        # If consecutive frames have almost 0 difference during scrolling
        if diff < 0.1: # identical/frozen frame
            current_frozen_streak += 1
        else:
            if current_frozen_streak >= 3: # 3+ frames frozen (~55ms+ freeze)
                jank_events.append({
                    "start_frame": frame_idx - current_frozen_streak,
                    "time_sec": round((frame_idx - current_frozen_streak) / fps, 2),
                    "frozen_frames": current_frozen_streak,
                    "duration_ms": round((current_frozen_streak / fps) * 1000, 1)
                })
            current_frozen_streak = 0
    prev_gray = gray
    frame_idx += 1

cap.release()

print(f"Total video frames: {frame_idx}")
print(f"Detected {len(jank_events)} jank/freeze events where screen froze for >= 3 consecutive frames:")
for j in jank_events:
    print(f"  At {j['time_sec']}s: frozen for {j['frozen_frames']} frames ({j['duration_ms']}ms)")

