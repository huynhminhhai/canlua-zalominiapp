import * as yup from 'yup';

export type FormDataFarmer = {
    id?: number;
    tenNongDan: string;
    donGia?: string;
    soDienThoai?: string;
    ghiChu?: string;
}

export const schemaFarmer = yup.object().shape({
    tenNongDan: yup.string().required('Không được để trống'),
});

export type FormDataFarmerResult = {
    id?: number;
    tenNongDan: string;
    donGia?: string | number;
    soDienThoai?: string;
    ghiChu?: string;
    truBaoBi?: number;
    truTapChat?: number;
    truTienCoc?: number;
    truTienDaTra?: number;
}

export const schemaFarmerResult = yup.object().shape({
    tenNongDan: yup.string().required('Không được để trống'),
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