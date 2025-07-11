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