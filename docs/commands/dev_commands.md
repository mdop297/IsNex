- create \_\_init\_\_.py file in all of directory from current directory

  ```
  find . -type d -exec touch {}/__init__.py \;
  ```

  - find . → tìm từ thư mục hiện tại (.).

  - type d → chỉ lấy directories (thư mục), bỏ qua file.

  - exec ... \; → với mỗi kết quả tìm được, thực thi command bên trong. `touch {}/**init**.py` → `{}` là placeholder cho đường dẫn folder hiện tại. Nghĩa là: trong folder nào tìm được, hãy tạo file **init**.py bên trong.
