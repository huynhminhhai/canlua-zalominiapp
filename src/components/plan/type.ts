export interface DangKyGoiSuDungDto {
    tenantId: number;
    chuKy: string;
    ngayBatDau: string; // ISO Date
    ngayKetThuc: string; // ISO Date
    trangThai: number;
    giaTien: number;
    phuongThucThanhToan: string | null;
    maThietBi: string | null;
    tuDongGiaHan: boolean;
    thoiGianTao: string; // ISO DateTime
    thoiGianCapNhat: string | null;
    daXoa: boolean;
    goiSuDungId: number;
}

export interface QrCodeResponseDto {
    responseCode: string;
    description: string;
    qrcodeData: string;
    qrcodeId: string;
    totalAmount: string;
    originalAmount: string;
    fee: string;
    createDate: string; // format: yyyyMMddHHmmss
    checksum: string;
    qrcodeImage: string; // base64
    billDetail: string | null;
    bankCode: string;
    bankName: string;
}

export interface RegisterQrCodeResponse {
    dangKyGoiSuDungDto: DangKyGoiSuDungDto;
    qrCodeResponseDto: QrCodeResponseDto;
}
