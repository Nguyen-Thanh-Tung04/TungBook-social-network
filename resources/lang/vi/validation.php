<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Validation Language Lines
    |--------------------------------------------------------------------------
    |
    | Các dòng sau chứa các thông báo lỗi mặc định sử dụng bởi validator.
    | Một số quy tắc có nhiều phiên bản, như các quy tắc kích thước.
    | Bạn có thể tùy chỉnh các thông báo này theo yêu cầu của ứng dụng.
    |
    */

    'accepted'             => 'Trường :attribute phải được chấp nhận.',
    'active_url'           => 'Trường :attribute không phải là một URL hợp lệ.',
    'after'                => 'Trường :attribute phải là một ngày sau :date.',
    'after_or_equal'       => 'Trường :attribute phải là một ngày sau hoặc bằng :date.',
    'alpha'                => 'Trường :attribute chỉ có thể chứa các chữ cái.',
    'alpha_dash'           => 'Trường :attribute chỉ có thể chứa các chữ cái, số, dấu gạch ngang và gạch dưới.',
    'alpha_num'            => 'Trường :attribute chỉ có thể chứa các chữ cái và số.',
    'array'                => 'Trường :attribute phải là một mảng.',
    'before'               => 'Trường :attribute phải là một ngày trước :date.',
    'before_or_equal'      => 'Trường :attribute phải là một ngày trước hoặc bằng :date.',
    'between'              => [
        'numeric' => 'Trường :attribute phải nằm trong khoảng :min - :max.',
        'file'    => 'Dung lượng file :attribute phải nằm trong khoảng :min - :max kilobytes.',
        'string'  => 'Trường :attribute phải có độ dài từ :min - :max ký tự.',
        'array'   => 'Trường :attribute phải có từ :min - :max phần tử.',
    ],
    'boolean'              => 'Trường :attribute phải là true hoặc false.',
    'confirmed'            => 'Trường xác nhận :attribute không khớp.',
    'date'                 => 'Trường :attribute không phải là một ngày hợp lệ.',
    'date_equals'          => 'Trường :attribute phải là một ngày bằng :date.',
    'date_format'          => 'Trường :attribute không khớp với định dạng :format.',
    'different'            => 'Trường :attribute và :other phải khác nhau.',
    'digits'               => 'Trường :attribute phải là :digits chữ số.',
    'digits_between'       => 'Trường :attribute phải nằm trong khoảng :min đến :max chữ số.',
    'dimensions'           => 'Trường :attribute có kích thước hình ảnh không hợp lệ.',
    'distinct'             => 'Trường :attribute có giá trị trùng lặp.',
    'email'                => 'Trường :attribute phải là một địa chỉ email hợp lệ.',
    'ends_with'            => 'Trường :attribute phải kết thúc bằng một trong các giá trị sau: :values.',
    'exists'               => 'Giá trị được chọn trong trường :attribute không hợp lệ.',
    'file'                 => 'Trường :attribute phải là một tệp.',
    'filled'               => 'Trường :attribute phải có giá trị.',
    'gt'                   => [
        'numeric' => 'Trường :attribute phải lớn hơn :value.',
        'file'    => 'Dung lượng file :attribute phải lớn hơn :value kilobytes.',
        'string'  => 'Trường :attribute phải dài hơn :value ký tự.',
        'array'   => 'Trường :attribute phải có nhiều hơn :value phần tử.',
    ],
    'gte'                  => [
        'numeric' => 'Trường :attribute phải lớn hơn hoặc bằng :value.',
        'file'    => 'Dung lượng file :attribute phải lớn hơn hoặc bằng :value kilobytes.',
        'string'  => 'Trường :attribute phải có ít nhất :value ký tự.',
        'array'   => 'Trường :attribute phải có :value phần tử trở lên.',
    ],
    'image'                => 'Trường :attribute phải là một ảnh.',
    'in'                   => 'Giá trị được chọn trong trường :attribute không hợp lệ.',
    'in_array'             => 'Trường :attribute không tồn tại trong :other.',
    'integer'              => 'Trường :attribute phải là số nguyên.',
    'ip'                   => 'Trường :attribute phải là một địa chỉ IP hợp lệ.',
    'ipv4'                 => 'Trường :attribute phải là một địa chỉ IPv4 hợp lệ.',
    'ipv6'                 => 'Trường :attribute phải là một địa chỉ IPv6 hợp lệ.',
    'json'                 => 'Trường :attribute phải là một chuỗi JSON hợp lệ.',
    'lt'                   => [
        'numeric' => 'Trường :attribute phải nhỏ hơn :value.',
        'file'    => 'Dung lượng file :attribute phải nhỏ hơn :value kilobytes.',
        'string'  => 'Trường :attribute phải ngắn hơn :value ký tự.',
        'array'   => 'Trường :attribute phải có ít hơn :value phần tử.',
    ],
    'lte'                  => [
        'numeric' => 'Trường :attribute phải nhỏ hơn hoặc bằng :value.',
        'file'    => 'Dung lượng file :attribute phải nhỏ hơn hoặc bằng :value kilobytes.',
        'string'  => 'Trường :attribute không được dài hơn :value ký tự.',
        'array'   => 'Trường :attribute không được có nhiều hơn :value phần tử.',
    ],
    'max'                  => [
        'numeric' => 'Trường :attribute không được lớn hơn :max.',
        'file'    => 'Dung lượng file :attribute không được lớn hơn :max kilobytes.',
        'string'  => 'Trường :attribute không được dài hơn :max ký tự.',
        'array'   => 'Trường :attribute không được có nhiều hơn :max phần tử.',
    ],
    'mimes'                => 'Trường :attribute phải là một tệp thuộc loại: :values.',
    'mimetypes'            => 'Trường :attribute phải là một tệp thuộc loại: :values.',
    'min'                  => [
        'numeric' => 'Trường :attribute phải có ít nhất :min.',
        'file'    => 'Dung lượng file :attribute phải có ít nhất :min kilobytes.',
        'string'  => 'Trường :attribute phải có ít nhất :min ký tự.',
        'array'   => 'Trường :attribute phải có ít nhất :min phần tử.',
    ],
    'not_in'               => 'Giá trị được chọn trong trường :attribute không hợp lệ.',
    'not_regex'            => 'Định dạng trường :attribute không hợp lệ.',
    'numeric'              => 'Trường :attribute phải là một số.',
    'password'             => 'Mật khẩu không chính xác.',
    'present'              => 'Trường :attribute phải tồn tại.',
    'regex'                => 'Định dạng trường :attribute không hợp lệ.',
    'required'             => 'Trường :attribute là bắt buộc.',
    'required_if'          => 'Trường :attribute là bắt buộc khi :other là :value.',
    'required_unless'      => 'Trường :attribute là bắt buộc trừ khi :other nằm trong :values.',
    'required_with'        => 'Trường :attribute là bắt buộc khi :values tồn tại.',
    'required_with_all'    => 'Trường :attribute là bắt buộc khi tất cả :values tồn tại.',
    'required_without'     => 'Trường :attribute là bắt buộc khi :values không tồn tại.',
    'required_without_all' => 'Trường :attribute là bắt buộc khi không có giá trị nào trong :values tồn tại.',
    'same'                 => 'Trường :attribute và :other phải khớp.',
    'size'                 => [
        'numeric' => 'Trường :attribute phải bằng :size.',
        'file'    => 'Dung lượng file :attribute phải bằng :size kilobytes.',
        'string'  => 'Trường :attribute phải chứa :size ký tự.',
        'array'   => 'Trường :attribute phải chứa :size phần tử.',
    ],
    'starts_with'          => 'Trường :attribute phải bắt đầu bằng một trong các giá trị sau: :values.',
    'string'               => 'Trường :attribute phải là một chuỗi.',
    'timezone'             => 'Trường :attribute phải là một múi giờ hợp lệ.',
    'unique'               => 'Trường :attribute đã được sử dụng.',
    'uploaded'             => 'Trường :attribute tải lên thất bại.',
    'url'                  => 'Định dạng trường :attribute không hợp lệ.',
    'uuid'                 => 'Trường :attribute phải là một UUID hợp lệ.',

    /*
    |--------------------------------------------------------------------------
    | Custom Validation Attributes
    |--------------------------------------------------------------------------
    |
    | Dòng sau dùng để thay đổi các thuộc tính thành tên thân thiện hơn
    | thay vì các tên thuộc tính mặc định như "email", "password".
    |
    */

    'attributes' => [
        'email' => 'email',
        'username' => 'tên người dùng',
        'password' => 'mật khẩu',
    ],
];
