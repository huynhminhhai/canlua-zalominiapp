import React from "react";
import { Box, Input } from "zmp-ui";
import { Control, Controller, ControllerRenderProps } from "react-hook-form";
import ErrorMessage from "./ErrorMessage";
import Label from "./Label";
import { formatCurrency } from "utils/number";

type InputNumericFieldProps = {
    label?: string;
    name: string;
    error?: string;
    field: ControllerRenderProps<any, string>;
    required?: boolean;
    placeholder?: string;
    disabled?: boolean;
    maxLength?: number;
};

// const InputNumericField: React.FC<InputNumericFieldProps> = ({
//     label,
//     name,
//     error,
//     field,
//     required = false,
//     placeholder,
//     disabled = false,
//     maxLength
// }) => {
//     return (
//         <Box pb={4} className="relative">
//             <Label name={name} text={label || ''} required={required} />
//             <Input
//                 id={name}
//                 type="text"
//                 inputMode="numeric"
//                 className="mt-1 block w-full"
//                 style={{ borderColor: error ? 'red' : '#b9bdc1' }}
//                 placeholder={placeholder}
//                 disabled={disabled}
//                 value={formatCurrency(field.value || '')}
//                 onChange={(e) => {
//                     const raw = e.target.value.replace(/[^0-9]/g, '');
//                     field.onChange(raw); // lưu số gốc
//                 }}
//                 maxLength={maxLength}
//             />
//             {error && <ErrorMessage message={error} />}
//         </Box>
//     );
// };


const InputNumericField: React.FC<InputNumericFieldProps> = ({
    label,
    name,
    error,
    field,
    required = false,
    placeholder,
    disabled = false,
    maxLength
}) => {
    return (
        <Box pb={4} className="relative">
            <Label name={name} text={label || ''} required={required} />
            <Input
                id={name}
                type="text"
                inputMode="numeric"
                className="mt-1 block w-full"
                style={{ borderColor: error ? 'red' : '#b9bdc1' }}
                placeholder={placeholder}
                disabled={disabled}
                value={formatCurrency(field.value ?? '')}
                onFocus={(e) => e.target.select()}
                onChange={(e) => {
                    const raw = e.target.value.replace(/[^0-9]/g, '');
                    const parsed = raw === '' ? 0 : Number(raw);
                    field.onChange(parsed);
                }}
                maxLength={maxLength}
            />
            {error && <ErrorMessage message={error} />}
        </Box>
    );
};


type FormInputNumericFieldProps = {
    name: string;
    label?: string;
    placeholder: string;
    control: Control<any>;
    error?: string;
    required?: boolean;
    disabled?: boolean;
    maxLength?: number;
};

const FormInputNumericField: React.FC<FormInputNumericFieldProps> = ({
    name,
    label,
    placeholder,
    control,
    error,
    required,
    disabled,
    maxLength
}) => {
    return (
        <Controller
            name={name}
            control={control}
            render={({ field }) => (
                <InputNumericField
                    label={label}
                    placeholder={placeholder}
                    name={name}
                    required={required}
                    field={field}
                    error={error}
                    disabled={disabled}
                    maxLength={maxLength}
                />
            )}
        />
    );
};

export default FormInputNumericField;
