import * as yup from 'yup';

export const schemaUser = yup.object().shape({
    username: yup.string().required('Tên người dùng không được để trống').min(3, 'Tên người dùng phải có ít nhất 3 ký tự').max(50, 'Tên người dùng không được vượt quá 50 ký tự').matches(/^[a-zA-Z0-9.]{0,51}$/, 'Tên người dùng không hợp lệ'),
    password: yup.string().required('Mật khẩu không được để trống').min(8, 'Mật khẩu phải có ít nhất 8 ký tự').max(100, 'Mật khẩu không được vượt quá 100 ký tự').matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*\_\-+=])[A-Za-z\d!@#$%^&*\_\-+=]+$/, 'Mật khẩu phải chứa ít nhất một chữ cái viết hoa, một chữ cái viết thường, một số và một ký tự đặc biệt'),
    confirmPassword: yup.string().required('Không được để trống').oneOf([yup.ref('password')], 'Mật khẩu xác nhận không khớp'),
    fullName: yup.string().required('Họ và tên không được để trống').min(1, 'Họ và tên phải có ít nhất 1 ký tự').max(50, 'Họ và tên không được vượt quá 50 ký tự'),
    email: yup.string().required('Email không được để trống').email('Email không hợp lệ').max(100, 'Email không được vượt quá 100 ký tự'),
    phoneNumber: yup.string().required('Số điện thoại không được để trống').length(10, 'Số điện thoại phải có đúng 10 số').matches(/^\d+$/, 'Số điện thoại phải là số'),
    gender: yup.string().required('Giới tính không được để trống').min(1, 'Giới tính phải có ít nhất 1 ký tự'),
    dob: yup.date().required('Ngày sinh không được để trống'),
    userRole: yup.string().required('Vai trò người dùng không được để trống').min(1, 'Vai trò người dùng phải có ít nhất 1 ký tự'),
});

export const schemaLandlordInfo = yup.object().shape({
    identity: yup.string().required('Số chứng minh thư không được để trống'),
    taxCode: yup.string().required('Mã số thuê không được để trống').length(10, 'Mã số thuế phải có đúng 10 số').matches(/^\d+$/, 'Mã số thuế phải là số'),
});


export const schemaPost = yup.object().shape({
    title: yup.string().required('Tiêu đề không được trống').min(20, 'Tiêu đề có tối thiểu 20 kí tự và tối đa 255 kí tự').max(255, 'Tiêu đề có tối thiểu 20 kí tự và tối đa 255 kí tự'),
    description: yup.string().required('Mô tả không được trống').min(50, 'Mô tả phải có ít nhất 50 kí tự và tối đa 65535 kí tự').max(65535, 'Mô tả phải có ít nhất 50 kí tự và tối đa 65535 kí tự'),
});

export const schemaPostRentDetail = yup.object().shape({
    price: yup.number().required('Giá không được trống').min(100000, 'Giá phải tối thiểu 100.000đ').max(100000000, 'Giá tối đa là 100.000.000đ').typeError('Giá trị phải là một số'),
    minPeople: yup.number().required('Số người tối thiểu không được trống').min(1, 'Số người tối thiểu phải ít nhất một người').typeError('Giá trị phải là một số'),
    maxPeople: yup.number().required('Số người tối đa không được trống').min(1, 'Số người tối đa phải ít nhất một người').typeError('Giá trị phải là một số').test('is-greater', 'Số người tối đa không được ít hơn số người tối thiểu', function (value) {
        return value >= this.parent.minPeople;
    }),
    area: yup.number().required('Diện tích không được trống').typeError('Giá trị phải là một số').moreThan(0, 'Diện tích phải lớn hơn 0'),
    numOfBedrooms: yup.number().required('Không được trống').typeError('Giá trị phải là một số').min(1, 'Số phòng ngủ tối thiểu là 1'),
    numOfBathrooms: yup.number().required('Không được trống').typeError('Giá trị phải là một số').min(1, 'Số nhà tắm tối thiểu là 1'),
});

export const schemaPostFindDetail = yup.object().shape({
    minPrice: yup.number().required('Giá không được trống').typeError('Giá trị phải là một số').min(100000, 'Giá phải tối thiểu 100.000đ').max(100000000, 'Giá tối đa là 100.000.000đ'),
    maxPrice: yup.number().required('Giá không được trống').typeError('Giá trị phải là một số').min(100000, 'Giá phải tối thiểu 100.000đ').max(100000000, 'Giá tối đa là 100.000.000đ'),
    location: yup.string().required("Khu vực không được trống"),
});

export const schemaMotel = yup.object().shape({
    name: yup.string().required('Tên nhà trọ không được rỗng').min(20, 'Tên nhà trọ phải từ 20 đến 100 kí tự').max(100, 'Tên nhà trọ phải từ 20 đến 100 kí tự'),
    fullLocation: yup.string().required('Địa chỉ không được trống').min(10, 'Địa chỉ phải từ 10 kí tự').max(150, 'Địa chỉ tối đa 150 kí tự'),
    locationLongitude: yup.string().required('Không tìm thấy tọa độ vị trí.'),
    locationLatitude: yup.string().required('Không tìm thấy tọa độ vị trí.'),
});