import * as yup from 'yup';

export type FormDataGroup = {
    id?: number;
    tenNhom: string;
    soDienThoai?: string;
    ghiChu?: string;
}

export const schemaGroup = yup.object().shape({
    tenNhom: yup.string().required('Không được để trống'),
});