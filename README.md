* ScrollView và FlatList:
- Chỉ cuộn được khi chiều dài hiển thị < chiều dài nội dung.
- Chiều dài hiển thị tối đa chỉ có thể bằng chiều cao còn lại của phần tử cha. Nếu phần tử cha không có chiều cao cụ thể thì chiều dài hiển thị = chiều dài nội dung (trường hợp này chắc chắn không cuộn được)

* Tài nguyên phân trang kiểu mũi tên chuyển trang không cần cache cho đơn giản vì dữ liệu ít.

* Chú ý Thêm, sửa, xóa tài nguyên trên trang List tài nguyên có phân trang kiểu cuộn:
1. Thêm, Sửa, Xóa thành công trên Server => Thêm, Sửa, Xóa List hiển thị. Lý do: Để nếu đang ở pageNumber > 1 thì không tải lại tài nguyên với pageNumber hiện tại để không gây trùng lặp dữ liệu và cũng không quay về pageNumber = 1 để duy trì pageNumber hiện tại.
2. Chú ý với thêm 1 tài nguyên
- Nếu trang cuối hiện tại không phải là trang cuối hoặc là trang cuối nhưng có số lượng LIMIT tài nguyên thì tài nguyên cuối của trang cuối sẽ bị đẩy sang trang sau thành tài nguyên đầu của trang sau => Cần xóa tài nguyên này ra khỏi list hiển thị và list cache (nếu có) để khớp phân trang.
- Trường hợp còn lại thì tài nguyên cuối của trang cuối hiện tại vẫn là tài nguyên cuối của trang cuối hiện tại => không làm gì.
3. Với xóa 1 tài nguyên thì:
- Nếu sau trang cuối hiện tại vẫn còn trang thì tài nguyên đầu tiên của trang tiếp theo sẽ là tài nguyên cuối của trang cuối hiện tại => cần truy vấn ra tài nguyên này và thêm vào List Hiển thị và List Cache(nếu có) để khớp phân trang.
- Nếu trang cuối hiện tại là trang cuối thật thì tài nguyên cuối của trang cuối hiện tại vẫn là tài nguyên cuối của trang cuối hiện tại => không làm gì.

