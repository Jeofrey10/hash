import os
import cv2
import numpy as np

frames_dir = "C:/hash.devs/tests/production-repair/video-frames"
frames = sorted(os.listdir(frames_dir))

for f in frames:
    img = cv2.imread(os.path.join(frames_dir, f))
    # calculate average brightness and green channel presence
    b, g, r = cv2.split(img)
    print(f"{f}: shape={img.shape}, avg_b={np.mean(b):.1f}, avg_g={np.mean(g):.1f}, avg_r={np.mean(r):.1f}")

