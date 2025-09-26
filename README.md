* ScrollView và FlatList:
- Chỉ cuộn được khi chiều dài hiển thị < chiều dài nội dung.
- Chiều dài hiển thị tối đa chỉ có thể bằng chiều cao còn lại của phần tử cha. Nếu phần tử cha không có chiều cao cụ thể thì chiều dài hiển thị = chiều dài nội dung (trường hợp này chắc chắn không cuộn được)

* Thêm sửa xóa tài nguyên trên trang List tài nguyên có phân trang:
- Sửa, xóa thành công trên Server => sửa, xóa cache (nếu có) + sửa xóa List hiển thị (phải sửa xóa List hiển thị để nếu đang ở pageNumber > 1 thì không reload để tránh tải lại pageNumber hiện tại gây trùng lặp dữ liệu).
- Thêm thành công trên Server => lấy tài nguyên mới nhận được rồi unshift cache và reset về pageNumber = 1 để hiển thị tài nguyên mới, nếu không có cache thì reset về pageNumber = 1 để tải lại tài nguyên từ đầu để hiển thị tài nguyên mới.
