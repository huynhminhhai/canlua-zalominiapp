import * as yup from 'yup';

export type FormDataFarmer = {
    id?: number;
    tenHoDan: string;
    donGia?: string;
    soDienThoai?: string;
    ghiChu?: string;
}

export const schemaFarmer = yup.object().shape({
    tenHoDan: yup.string().required('Không được để trống'),
});

export type FormDataFarmerResult = {
    id?: number;
    tenHoDan: string;
    donGia?: string | number;
    quyCachTruBi?: number;
    truTapChat?: number;
    tienCoc?: number;
    tienDaTra?: number;
}

export const schemaFarmerResult = yup.object().shape({
    tenHoDan: yup.string().required('Không được để trống'),
});

export type PhienCan = {
    choPhepNhapSoLe: boolean;
    donGia: number;
    id: number;
    maPhienCan: string | null;
    ngayCapNhat: string | null;
    ngayTao: string;
    nguoiCapNhat: string | null;
    nguoiTao: string;
    nhomThuMuaId: number;
    quyCachNhap: number;
    quyCachTruBi: number;
    soLanCan: number;
    soLuongMoiTrang: number;
    soThapPhan: number;
    suDungTrungTen: boolean;
    tenHoDan: string;
    tenantId: number;
    tienCoc: number;
    tienDaTra: number;
    tongTrongLuong: number;
    trangThai: number;
    trongLuong: number;
    truTapChat: number;
};

export function tinhKhoiLuongThucTe({
    tongKhoiLuong,
    soLanCan,
    quyCachTruBi,
    truTapChat,
    roundWeight,
    parseNumber,
}: {
    tongKhoiLuong: number;
    soLanCan: number;
    quyCachTruBi: any; 
    truTapChat: any;  
    roundWeight: (value: number, mode: 'nearest', precision: number) => number;
    parseNumber: (value: any) => number;
}): number {
    const _truBaoBi = parseNumber(quyCachTruBi);
    const _truTapChat = parseNumber(truTapChat);

    const khoiLuongTruBaoBi =
        _truBaoBi === 0 ? 0 : roundWeight(soLanCan / _truBaoBi, 'nearest', 1);

    const result = Number(
        (tongKhoiLuong - khoiLuongTruBaoBi - _truTapChat).toFixed(1)
    );

    return result;
}