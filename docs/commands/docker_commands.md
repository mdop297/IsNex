## 🔹 Docker build & run

- **Build image từ Dockerfile**

  ```bash
  docker build -t my-app .
  ```

  (`-t` = đặt tên cho image)

- **Chạy container từ image**

  ```bash
  docker run -p 5000:5000 my-app
  ```

  (`-p` map port host\:container, ví dụ truy cập localhost:5000)

- **Chạy container MỚI HOÀN TOÀN với interactive shell (debug), khi tắt terminal, container cũng sẽ mất**

  ```bash
  docker run -it my-app sh
  ```

---

## 🔹 Quản lý container

- **Xem container đang chạy**

  ```bash
  docker ps
  ```

- **Xem tất cả container (kể cả stop)**

  ```bash
  docker ps -a
  ```

- **Dừng container**

  ```bash
  docker stop <container_id_or_name>
  ```

- **Xoá container**

  ```bash
  docker rm <container_id_or_name>
  ```

- **Xoá tất cả container stop**

  ```bash
  docker container prune
  ```

---

## 🔹 Quản lý image

- **Xem image**

  ```bash
  docker images
  ```

- **Xoá image**

  ```bash
  docker rmi <image_id_or_name>
  ```

- **Xoá tất cả image không dùng**

  ```bash
  docker image prune -a
  ```

---

## 🔹 Debug & Logs

- **Xem logs của container**

  ```bash
  docker logs -f <container_id_or_name>
  ```

- **Vào trong container ĐANG CHẠY (giữ nguyên trạng thái, có dữ liệu từ trước đó)**

  ```bash
  docker exec -it <container_id_or_name> sh
  ```

  (hoặc `bash` nếu container có bash)

---

## 🔹 Docker Compose (nếu bạn dùng nhiều service)

- **Start tất cả service**

  ```bash
  docker compose up
  ```

- **Start + chạy nền**

  ```bash
  docker compose up -d
  ```

- **Stop service**

  ```bash
  docker compose down
  ```

- **Rebuild khi có thay đổi Dockerfile**

  ```bash
  docker compose up --build
  ```

---

## how to write Dockerfile

- write base image
- build docker image from Dockerfile
- run container in interactive mode
- run commands
- write those command in Dockerfile
- rebuild image
- run container in interactive mode

### Notes when writing Dockerfile

- **`.dockerignore`**

  - Build context ở đâu thì Docker chỉ lấy `.dockerignore` ở đúng thư mục đó.
  - `.dockerignore` giúp loại bỏ file/folder không cần thiết (vd: `node_modules`, `.git`, `*.log`) để tránh bị copy vào context → giảm size, tăng tốc build.

- **Build context**

  - Context chỉ bao gồm những files/folders nằm **cùng level hoặc thấp hơn** build context.
  - Nếu file nằm **ngoài context**, Docker không thấy được.
  - Vị trí của `Dockerfile` không quyết định gì, cái quan trọng là context khi chạy lệnh `docker build`.

- **Multi-stage build**

  - Stage 1: build app (ví dụ Next.js), thường cần dev dependencies (nặng).
  - Stage 2 (runtime): chỉ copy kết quả cần chạy (`.next/`, `node_modules --prod`, `package.json`) → final image nhỏ, chạy nhanh.

- **Install dependencies trong workspace (monorepo)**

  - Dùng `--filter` để chỉ install đúng package thay vì install toàn bộ workspace.
  - Ví dụ:

    ```dockerfile
    RUN pnpm install --frozen-lockfile --filter client...
    ```

- Luôn set `NODE_ENV=production` trong runtime stage để tránh cài dev deps.
- Ưu tiên `COPY package.json pnpm-lock.yaml` trước khi `RUN pnpm install` → tránh invalidating cache.
