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