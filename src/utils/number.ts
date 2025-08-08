
export function convertNumberVND(amount: number): string {
    return amount.toLocaleString("vi-VN", { style: "currency", currency: "VND" })
}

export function maskPhoneNumber(phone: string): string {
    return phone?.replace(/(\d{3})\d+(\d{2})/, '$1*****$2');
}

export function formatPhoneNumber(phone: string): string {
    if (!phone) return '';

    // Xóa tất cả ký tự không phải số
    const digits = phone.replace(/\D/g, '');

    // Nếu bắt đầu bằng 84 và có độ dài đủ (ít nhất 11 số)
    if (digits.startsWith('84') && digits.length >= 11) {
        return '0' + digits.substring(2);
    }

    // Nếu đã đúng định dạng 0xxxxxxxxx thì giữ nguyên
    if (digits.startsWith('0') && digits.length === 10) {
        return digits;
    }

    // Trường hợp không rõ ràng, trả về nguyên bản số đã được lọc
    return digits;
}

export const formatCurrency = (value: string | number) => {
    const strValue = String(value); // ép về string an toàn
    const numericValue = strValue.replace(/[^0-9]/g, '');
    if (!numericValue) return '';
    return new Intl.NumberFormat('vi-VN').format(Number(numericValue));
};

export const formatCurrencyVN = (value?: number | string): string => {
    const number = Number(value ?? 0);
    return isNaN(number) ? '0' : number.toLocaleString('vi-VN');
};

export const roundWeight = (
    weight: number,
    type: 'up' | 'down' | 'nearest' = 'nearest',
    decimal: number = 1
): number => {
    if (typeof weight !== 'number' || isNaN(weight)) return 0;
    if (typeof decimal !== 'number' || isNaN(decimal) || decimal < 0) decimal = 0;

    const factor = Math.pow(10, decimal);

    if (factor === 0) return 0;

    if (type === 'up') return Math.ceil(weight * factor) / factor;
    if (type === 'down') return Math.floor(weight * factor) / factor;
    return Math.round(weight * factor) / factor;
};

export const parseNumber = (value: any, fallback = 0) => {
    const n = parseFloat(String(value).replace(',', '.'));
    return isNaN(n) ? fallback : n;
};

export function replaceDotToComma(value) {
    if (value == null) return '';
    return String(value).replace('.', ',');
}