import * as yup from 'yup';

export type GroupItemType = {
    id: number;
    tenantId: number;
    maNhom: string | null;
    tenNhom: string;
    trangThai: string;
    moTa: string;
    ngayTao: string; // ISO date string
    nguoiTao: string;
    ngayCapNhat: string | null;
    nguoiCapNhat: string | null;
    soLanCan: number;
    tongTrongLuong: number;
    soPhienCan: number;
    tongTien: number;
}

export type FormDataGroup = {
    id?: number;
    tenNhom: string;
    moTa?: string;
}

export const schemaGroup = yup.object().shape({
    tenNhom: yup.string().required('Không được để trống'),
});