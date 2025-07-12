import React, { useState } from "react";
import { Button, Input } from "zmp-ui"; // Điều chỉnh theo thư viện UI của bạn

// Khai báo kiểu dữ liệu
type OCan = number | null;
type Bang = OCan[][];
type Trang = Bang[];

const soCot = 5;
const soDong = 5;
const soBangMoiTrang = 3;

export default function NhapCan() {
  const taoBangRong = (): Bang =>
    Array.from({ length: soDong }, () =>
      Array.from({ length: soCot }, () => null)
    );

  const taoTrangRong = (): Trang =>
    Array.from({ length: soBangMoiTrang }, () => taoBangRong());

  const [trangs, setTrangs] = useState<Trang[]>([taoTrangRong()]);
  const [trangHienTai, setTrangHienTai] = useState(0);

  const capNhatO = (
    trangIndex: number,
    bangIndex: number,
    dong: number,
    cot: number,
    value: number
  ) => {
    const newTrangs = [...trangs];
    newTrangs[trangIndex][bangIndex][dong][cot] = value;
    setTrangs(newTrangs);

    // Gọi API lưu giá trị
    fetch("/api/can", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phienCanId: 1, // Tùy chỉnh theo dữ liệu thực tế
        trongLuong: value,
        viTriTrang: trangIndex,
        viTriBang: bangIndex,
        viTriDong: dong,
        viTriCot: cot,
      }),
    });
  };

  const tinhTongTrang = (trang: Trang) => {
    let sum = 0;
    for (const bang of trang) {
      for (const row of bang) {
        for (const cell of row) {
          sum += cell ?? 0;
        }
      }
    }
    return sum;
  };

  const tinhTongTatCa = () => {
    let sum = 0;
    for (const trang of trangs) {
      for (const bang of trang) {
        for (const row of bang) {
          for (const cell of row) {
            sum += cell ?? 0;
          }
        }
      }
    }
    return sum;
  };

  const themTrang = () => {
    const trangMoi = taoTrangRong();
    setTrangs([...trangs, trangMoi]);
    setTrangHienTai(trangs.length);
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">Trang {trangHienTai + 1}</h2>

      <div className="flex gap-4">
        {trangs[trangHienTai].map((bang, bangIndex) => (
          <div key={bangIndex} className="space-y-1">
            {bang.map((row, dong) => (
              <div key={dong} className="flex gap-1">
                {row.map((value, cot) => (
                  <Input
                    key={cot}
                    type="number"
                    className="w-16 text-center"
                    value={value ?? ""}
                    onChange={(e) =>
                      capNhatO(
                        trangHienTai,
                        bangIndex,
                        dong,
                        cot,
                        Number(e.target.value)
                      )
                    }
                  />
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 pt-2">
        <Button
          disabled={trangHienTai === 0}
          onClick={() => setTrangHienTai((prev) => prev - 1)}
        >
          Trang trước
        </Button>
        <Button
          disabled={trangHienTai === trangs.length - 1}
          onClick={() => setTrangHienTai((prev) => prev + 1)}
        >
          Trang sau
        </Button>
        <Button onClick={themTrang}>+ Thêm trang</Button>
      </div>

      <div className="pt-2">
        <p>
          Tổng trang hiện tại:{" "}
          <strong>{tinhTongTrang(trangs[trangHienTai])}</strong>
        </p>
        <p>
          Tổng toàn bộ: <strong>{tinhTongTatCa()}</strong>
        </p>
      </div>
    </div>
  );
}
