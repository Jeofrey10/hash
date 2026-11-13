import cv2
import os

video_path = "C:/Users/KANIMOZHI/.gemini/antigravity/brain/724fa76e-f8f7-41ea-be9a-6c59763484a4/.user_uploaded/media_1794608920489_553d5807.mp4"
output_dir = "C:/hash.devs/tests/production-repair/video-frames"
os.makedirs(output_dir, exist_ok=True)

cap = cv2.VideoCapture(video_path)
fps = cap.get(cv2.CAP_PROP_FPS)
total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
duration = total_frames / fps if fps > 0 else 0

print(f"Video Info: {width}x{height}, {fps:.2f} FPS, {total_frames} frames, duration: {duration:.2f}s")

# Extract 1 frame per second
sec = 0
while cap.isOpened():
    frame_no = int(sec * fps)
    if frame_no >= total_frames:
        break
    cap.set(cv2.CAP_PROP_POS_FRAMES, frame_no)
    ret, frame = cap.read()
    if not ret:
        break
    frame_file = os.path.join(output_dir, f"frame_{sec:02d}s.jpg")
    cv2.imwrite(frame_file, frame)
    sec += 2

cap.release()
print(f"Extracted frames every 2 seconds into {output_dir}")

