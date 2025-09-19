import { Icon } from '@iconify/react';
import { useCreateGiaTriCan, useGetGiaTriCanList } from 'apiRequest/giaTriCan';
import videos from 'assets/videos';
import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useStoreApp } from 'store/store';
import useClickOutside from 'utils/useClickOutSide';
import InputGuide from './InputGuide';
import { replaceDotToComma } from 'utils/number';

interface WeightData {
  phienCanId?: number; // Optional cho lần đầu tạo mới
  trongLuong: number;
  viTriTrang: number;
  viTriBang: number;
  viTriCot: number;
  viTriDong: number;
}

interface CellData {
  value: string;
  isComplete: boolean;
}

const RiceWeightInput: React.FC = () => {

  const { setPhienCan, phienCan, account, setIsShowModalIsLogin } = useStoreApp();

  const [isEditable, setIsEditable] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentTable, setCurrentTable] = useState(1);
  const [currentRow, setCurrentRow] = useState(0);
  const [currentCol, setCurrentCol] = useState(0);
  const limitInput = phienCan?.quyCachNhap || 2;
  const numberOfTables = phienCan?.soLuongMoiTrang === 75 ? 3 : 4;

  const [searchParams] = useSearchParams();
  const phienCanId = searchParams.get("id");

  const { mutateAsync: createGiaTriCan } = useCreateGiaTriCan();
  const { data: phienCanData } = useGetGiaTriCanList(Number(phienCanId));

  // Khởi tạo dữ liệu cho nhiều trang, mỗi trang có 3 hoặc 4 bảng, mỗi bảng 5x5 ô
  const [pagesData, setPagesData] = useState<CellData[][][][]>(() => {
    const initData: CellData[][][][] = [];
    // Khởi tạo trang đầu tiên
    const firstPage: CellData[][][] = [];
    for (let table = 0; table < numberOfTables; table++) {
      const tableRows: CellData[][] = [];
      for (let row = 0; row < 5; row++) {
        const tableCols: CellData[] = [];
        for (let col = 0; col < 5; col++) {
          tableCols.push({
            value: '',
            isComplete: false
          });
        }
        tableRows.push(tableCols);
      }
      firstPage.push(tableRows);
    }
    initData.push(firstPage);
    return initData;
  });

  const inputRefs = useRef<(HTMLInputElement | null)[][][]>([]);
  const hiddenInputRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handlePlayAudio = () => {
    audioRef.current?.play();
  };

  // Khởi tạo refs cho trang hiện tại
  useEffect(() => {
    inputRefs.current = Array(numberOfTables).fill(null).map(() =>
      Array(5).fill(null).map(() => Array(5).fill(null))
    );
  }, [currentPage]);

  // Tạo trang mới nếu chưa tồn tại
  const ensurePageExists = (pageIndex: number) => {
    if (!pagesData[pageIndex]) {
      const newPagesData = [...pagesData];
      const newPage: CellData[][][] = [];

      for (let table = 0; table < numberOfTables; table++) {
        const tableRows: CellData[][] = [];
        for (let row = 0; row < 5; row++) {
          const tableCols: CellData[] = [];
          for (let col = 0; col < 5; col++) {
            tableCols.push({
              value: '',
              isComplete: false
            });
          }
          tableRows.push(tableCols);
        }
        newPage.push(tableRows);
      }

      newPagesData[pageIndex] = newPage;
      setPagesData(newPagesData);
    }
  };

  const getCurrentPageData = () => {
    return pagesData[currentPage - 1] || [];
  };

  // Hàm gọi API để lưu dữ liệu
  const saveWeightData = async (weightData: WeightData) => {

    console.log('🚀 Calling API with data:', { ...weightData, phienCanId: Number(phienCanId) });

    try {

      const dataSubmit = { ...weightData, phienCanId: Number(phienCanId) };

      const response = await createGiaTriCan(dataSubmit);

      if (response && response.result) {
        setPhienCan(response.result?.phienCan);
      }

    } catch (error) {
      console.error('Error calling API:', error);
      throw error;
    }
  };

  const handleInputChange = (value: string, table: number, row: number, col: number) => {
    // Chỉ cho phép số và dấu chấm thập phân
    if (!/^\d*\.?\d*$/.test(value)) return;

    // Giới hạn độ dài input
    if (value.length > limitInput) return;

    const newPagesData = [...pagesData];
    const currentPageData = newPagesData[currentPage - 1];

    if (currentPageData) {
      // Cập nhật giá trị hiển thị
      currentPageData[table - 1][row][col].value = value;

      // Kiểm tra xem có phải nhập số lẻ không
      const isDecimalMode = phienCan?.choPhepNhapSoLe;
      const decimalPlaces = phienCan?.soThapPhan || 1;

      // Xác định điều kiện hoàn thành
      let isComplete = false;
      let processedValue = value;

      if (isDecimalMode) {
        // Nếu cho phép nhập số lẻ
        if (value.length === limitInput) {
          // Tự động thêm dấu chấm thập phân nếu chưa có
          if (!value.includes('.')) {
            const integerPart = value.slice(0, -decimalPlaces);
            const decimalPart = value.slice(-decimalPlaces);
            processedValue = `${integerPart}.${decimalPart}`;

            // Cập nhật giá trị hiển thị với dấu chấm
            currentPageData[table - 1][row][col].value = processedValue;
          }
          isComplete = true;
        }
      } else {
        // Nếu chỉ nhập số nguyên
        if (value.length === limitInput) {
          isComplete = true;
        }
      }

      // Cập nhật trạng thái hoàn thành
      currentPageData[table - 1][row][col].isComplete = isComplete;
      setPagesData(newPagesData);

      // Nếu đã hoàn thành, gọi API và chuyển ô tiếp theo
      if (isComplete) {
        // Chuẩn bị dữ liệu cho API
        const weightData: WeightData = {
          trongLuong: isDecimalMode
            ? parseFloat(processedValue)
            : parseInt(processedValue),
          viTriTrang: currentPage,
          viTriBang: table,
          viTriCot: col + 1,
          viTriDong: row + 1
        };

        if (!account) {
          setIsShowModalIsLogin(true);
          return
        }

        saveWeightData(weightData);
        moveToNextCell();
      }
    }
  };

  const parseCellValue = (cellValue: string): number => {
    if (!cellValue) return 0;

    // Nếu có dấu chấm thì parse float, không thì parse int
    if (cellValue.includes('.')) {
      return parseFloat(cellValue) || 0;
    }
    return parseInt(cellValue) || 0;
  };

  const handleInputFocus = (page: number, table: number, row: number, col: number) => {
    const nextEmptyPosition = findNextEmptyCell();

    // Tính toán index tuyến tính để so sánh dễ dàng
    const getLinearIndex = (pos: any) => {
      return (pos.page - 1) * (numberOfTables * 5 * 5) +
        (pos.table - 1) * (5 * 5) +
        pos.col * 5 +
        pos.row;
    };

    const currentClickIndex = getLinearIndex({ page, table, row, col });
    const nextEmptyIndex = getLinearIndex(nextEmptyPosition);

    // Nếu click vào ô phía sau ô input mới nhất
    if (currentClickIndex > nextEmptyIndex) {
      // Focus vào ô input mới nhất
      setCurrentPage(nextEmptyPosition.page);
      setCurrentTable(nextEmptyPosition.table);
      setCurrentRow(nextEmptyPosition.row);
      setCurrentCol(nextEmptyPosition.col);

      setTimeout(() => {
        const nextInput = inputRefs.current[nextEmptyPosition.table - 1]?.[nextEmptyPosition.row]?.[nextEmptyPosition.col];
        if (nextInput) {
          nextInput.focus();
          nextInput.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'center'
          });
        }
      }, 0);
    } else {
      // Focus bình thường
      setCurrentPage(page);
      setCurrentTable(table);
      setCurrentRow(row);
      setCurrentCol(col);
    }
  };

  const moveToNextCell = () => {
    let nextCol = currentCol;
    let nextRow = currentRow + 1;
    let nextTable = currentTable;
    let nextPage = currentPage;

    // Chuyển đến hàng tiếp theo (di chuyển theo chiều dọc)
    if (nextRow >= 5) {
      nextRow = 0;
      nextCol = currentCol + 1;
      handlePlayAudio();


      // Chuyển đến cột tiếp theo
      if (nextCol >= 5) {
        nextCol = 0;
        nextTable = currentTable + 1;

        // Chuyển đến bảng tiếp theo trong cùng trang
        if (nextTable > numberOfTables) {
          nextTable = 1;
          nextPage = currentPage + 1;

          // Tạo trang mới nếu cần
          ensurePageExists(nextPage - 1);
        }
      }
    }

    setCurrentPage(nextPage);
    setCurrentTable(nextTable);
    setCurrentRow(nextRow);
    setCurrentCol(nextCol);
  };

  // Hàm tính tổng cột
  const getColumnSum = (table: number, col: number) => {
    const currentPageData = getCurrentPageData();
    if (!currentPageData[table - 1]) return 0;

    const sum = currentPageData[table - 1].reduce((sum, row) => {
      const cellValue = parseCellValue(row[col].value);
      return sum + cellValue;
    }, 0);

    // Làm tròn theo số thập phân được cấu hình
    const decimalPlaces = phienCan?.soThapPhan || 1;
    return Math.round(sum * Math.pow(10, decimalPlaces)) / Math.pow(10, decimalPlaces);
  };

  // Hàm tính tổng trang
  const getPageTotalSum = () => {
    const currentPageData = getCurrentPageData();
    const sum = currentPageData.reduce((total, table) =>
      total + table.reduce((tableSum, row) =>
        tableSum + row.reduce((rowSum, cell) => {
          const cellValue = parseCellValue(cell.value);
          return rowSum + cellValue;
        }, 0), 0), 0);

    // Làm tròn theo số thập phân được cấu hình
    const decimalPlaces = phienCan?.soThapPhan || 1;
    return Math.round(sum * Math.pow(10, decimalPlaces)) / Math.pow(10, decimalPlaces);
  };

  // Hàm tính tổng tất cả trang
  const getAllPagesTotal = () => {
    const sum = pagesData.reduce((grandTotal, page) =>
      grandTotal + page.reduce((pageTotal, table) =>
        pageTotal + table.reduce((tableSum, row) =>
          tableSum + row.reduce((rowSum, cell) => {
            const cellValue = parseCellValue(cell.value);
            return rowSum + cellValue;
          }, 0), 0), 0), 0);

    // Làm tròn theo số thập phân được cấu hình
    const decimalPlaces = phienCan?.soThapPhan || 1;
    return Math.round(sum * Math.pow(10, decimalPlaces)) / Math.pow(10, decimalPlaces);
  };

  const getCompletedCellsCount = () => {
    return pagesData.reduce((total, page) =>
      total + page.flat().flat().filter(cell => cell.isComplete).length, 0);
  };

  const getCurrentPageCompletedCount = () => {
    const currentPageData = getCurrentPageData();
    return currentPageData.flat().flat().filter(cell => cell.isComplete).length;
  };

  const goToPage = (pageNum: number) => {
    if (pageNum > 0) {
      ensurePageExists(pageNum - 1);

      setCurrentPage(pageNum);
      setCurrentTable(1);
      setCurrentRow(0);
      setCurrentCol(0);
    }
  };

  const currentPageData = getCurrentPageData();

  // Tìm ô input mới nhất có giá trị và trả về vị trí ô kế tiếp
  const findNextEmptyCell = () => {
    let lastFilledPosition = { page: 1, table: 1, row: 0, col: 0 };
    let foundAnyFilled = false;

    // Duyệt qua tất cả các trang
    for (let pageIndex = 0; pageIndex < pagesData.length; pageIndex++) {
      const pageData = pagesData[pageIndex];

      // Duyệt qua các bảng theo thứ tự
      for (let tableIndex = 0; tableIndex < pageData.length; tableIndex++) {
        const tableData = pageData[tableIndex];

        // Duyệt qua các cột trước
        for (let col = 0; col < 5; col++) {
          // Duyệt qua các hàng trong cột
          for (let row = 0; row < 5; row++) {
            const cell = tableData[row][col];
            if (cell.value !== '' && cell.value !== null && cell.value !== undefined) {
              lastFilledPosition = {
                page: pageIndex + 1,
                table: tableIndex + 1,
                row: row,
                col: col
              };
              foundAnyFilled = true;
            }
          }
        }
      }
    }

    // Nếu không có ô nào được điền, trả về vị trí đầu tiên
    if (!foundAnyFilled) {
      return { page: 1, table: 1, row: 0, col: 0 };
    }

    // Tìm ô kế tiếp của ô cuối cùng được điền
    let nextPosition = { ...lastFilledPosition };

    // Di chuyển đến ô kế tiếp (theo chiều dọc)
    nextPosition.row += 1;

    if (nextPosition.row >= 5) {
      nextPosition.row = 0;
      nextPosition.col += 1;

      if (nextPosition.col >= 5) {
        nextPosition.col = 0;
        nextPosition.table += 1;

        if (nextPosition.table > numberOfTables) {
          nextPosition.table = 1;
          nextPosition.page += 1;

          // Đảm bảo trang mới tồn tại
          ensurePageExists(nextPosition.page - 1);
        }
      }
    }

    return nextPosition;
  };

  const handleFocusTrick = () => {
    if (hiddenInputRef.current) {
      if (!isEditable) {
        hiddenInputRef.current.focus();
      }

      // Chờ một chút rồi chuyển focus
      setTimeout(() => {
        handleToggleEditable();
      }, 50);
    }
  };

  const handleToggleEditable = () => {
    setIsEditable(!isEditable);

    if (!isEditable) {
      // Khi chuyển sang chế độ editable, tìm ô kế tiếp để focus
      const nextPosition = findNextEmptyCell();

      // Cập nhật current position
      setCurrentPage(nextPosition.page);
      setCurrentTable(nextPosition.table);
      setCurrentRow(nextPosition.row);
      setCurrentCol(nextPosition.col);

      setTimeout(() => {
        const nextInput = inputRefs.current[nextPosition.table - 1]?.[nextPosition.row]?.[nextPosition.col];
        if (nextInput) {
          nextInput.focus();

          nextInput.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'center'
          });
        }
      }, 100);
    }
  };

  // Thêm hàm để map dữ liệu từ API vào state
  const mapApiDataToState = (apiData: any) => {
    const { danhSachTrang } = apiData.result;

    const newPagesData: CellData[][][][] = [];

    // Duyệt qua từng trang
    danhSachTrang.forEach((trang, pageIndex) => {
      const pageData: CellData[][][] = [];

      // Khởi tạo 3 bảng cho mỗi trang
      for (let tableIndex = 0; tableIndex < numberOfTables; tableIndex++) {
        const tableData: CellData[][] = [];

        // Khởi tạo 5 hàng cho mỗi bảng
        for (let rowIndex = 0; rowIndex < 5; rowIndex++) {
          const rowData: CellData[] = [];

          // Khởi tạo 5 cột cho mỗi hàng
          for (let colIndex = 0; colIndex < 5; colIndex++) {
            rowData.push({
              value: '',
              isComplete: false
            });
          }

          tableData.push(rowData);
        }

        pageData.push(tableData);
      }

      // Map dữ liệu từ API vào structure đã khởi tạo
      trang.danhSachBang.forEach((bang) => {
        const tableIndex = bang.viTriBang - 1; // Convert to 0-based index

        if (tableIndex >= 0 && tableIndex < numberOfTables) {
          bang.grid.cells.forEach((cot) => {
            const colIndex = cot.viTriCot - 1; // Convert to 0-based index

            if (colIndex >= 0 && colIndex < 5) {
              cot.rows.forEach((dong) => {
                const rowIndex = dong.viTriDong - 1; // Convert to 0-based index

                if (rowIndex >= 0 && rowIndex < 5 && dong.trongLuong > 0) {
                  pageData[tableIndex][rowIndex][colIndex] = {
                    value: dong.trongLuong.toString(),
                    isComplete: true
                  };
                }
              });
            }
          });
        }
      });

      newPagesData.push(pageData);
    });

    // Nếu không có dữ liệu từ API, tạo ít nhất 1 trang trống
    if (newPagesData.length === 0) {
      const emptyPage: CellData[][][] = [];
      for (let table = 0; table < numberOfTables; table++) {
        const tableRows: CellData[][] = [];
        for (let row = 0; row < 5; row++) {
          const tableCols: CellData[] = [];
          for (let col = 0; col < 5; col++) {
            tableCols.push({
              value: '',
              isComplete: false
            });
          }
          tableRows.push(tableCols);
        }
        emptyPage.push(tableRows);
      }
      newPagesData.push(emptyPage);
    }

    setPagesData(newPagesData);

    // Chuyển đến trang cuối cùng trong danh sách
    setCurrentPage(newPagesData.length);
  };

  useEffect(() => {
    if (phienCanData && phienCanData.result) {
      mapApiDataToState(phienCanData);
    }
  }, [phienCanData]);

  useClickOutside(inputRef, () => {
    setIsEditable(false);
  });

  return (
    <div className="max-w-4xl mx-auto bg-transparent min-h-screen" ref={inputRef}>
      <audio src={videos.chanMa} controls ref={audioRef} hidden></audio>
      <div className="rounded-lg shadow-lg py-3 px-2">
        <input
          ref={hiddenInputRef}
          className="absolute opacity-0 w-0 h-0"
          type="text"
        />

        <InputGuide phienCan={phienCan} />

        {/* Page Navigation */}
        <div className="flex items-center gap-2 mb-6 flex-wrap">
          <span className="text-lg font-medium text-gray-700">Trang:</span>
          {Array.from({ length: Math.max(currentPage, pagesData.length) }, (_, i) => i + 1).map(pageNum => (
            <button
              key={pageNum}
              onClick={() => goToPage(pageNum)}
              className={`shawow-md px-3 py-1 rounded text-sm font-medium transition-colors ${pageNum === currentPage
                ? 'bg-gradient-to-br from-heading-color to-primary-color text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
            >
              {pageNum}
            </button>
          ))}
        </div>

        <div className='flex items-center justify-center mb-2 mt-4'>
          <button
            onClick={handleFocusTrick}
            className="px-6 py-3 bg-gradient-to-br from-heading-color to-primary-color text-[16px] text-white border-primary-color border rounded-full font-semibold mx-auto mb-3 flex items-center gap-2 shadow-md"
          >
            <span>
              {isEditable ? 'Chuyển sang chế độ xem' : 'Bắt đầu nhập số cân'}
            </span>
            <Icon icon={isEditable ? 'mdi:lock-outline' : 'mdi:lock-open-outline'} fontSize={18} />
          </button>
        </div>

        <div className="space-y-6 mb-6">
          {(phienCan?.soLuongMoiTrang === 75 ? [1, 2, 3] : [1, 2, 3, 4]).map((tableNum) => (
            <div key={tableNum} className={`bg-white border rounded-lg overflow-hidden transition-all duration-300 shadow-md`}>
              <div className={`px-4 py-3 text-lg text-center font-semibold text-white bg-gradient-to-br from-primary-color to-primary-color`}>
                Bảng {tableNum} - Trang {currentPage}
              </div>

              <div className="px-1 py-2">
                <div className="grid grid-cols-5 gap-1 mb-1">
                  {['C1', 'C2', 'C3', 'C4', 'C5'].map((col) => (
                    <div key={col} className="text-center text-lg font-semibold text-primary-color py-1">
                      {col}
                    </div>
                  ))}
                </div>

                <div className="space-y-1">
                  {currentPageData[tableNum - 1]?.map((row, rowIndex) => (
                    <div key={rowIndex} className="grid grid-cols-5 gap-1">
                      {row.map((cell, colIndex) => (
                        <div key={colIndex} className="relative">
                          <input
                            inputMode='numeric'
                            pattern="[0-9]*"
                            ref={(el) => {
                              if (inputRefs.current[tableNum - 1]) {
                                inputRefs.current[tableNum - 1][rowIndex][colIndex] = el;

                                // Focus ngay khi element được gán và đây là vị trí hiện tại
                                if (el && isEditable && tableNum === currentTable && rowIndex === currentRow && colIndex === currentCol) {
                                  setTimeout(() => {
                                    el.focus();
                                  }, 0);
                                }
                              }
                            }}
                            onClick={() => handleInputFocus(currentPage, tableNum, rowIndex, colIndex)}
                            onFocus={(e) => e.target.select()}
                            type="text"
                            // value={cell.value}
                            value={cell.value?.toString().replace('.', ',')}
                            // onInput={(e) => handleInputChange((e.target as HTMLInputElement).value, tableNum, rowIndex, colIndex)}
                            onInput={(e) => {
                              const rawValue = (e.target as HTMLInputElement).value;
                              // LƯU: đổi dấu , -> .
                              handleInputChange(rawValue.replace(',', '.'), tableNum, rowIndex, colIndex);
                            }}
                            maxLength={limitInput}
                            className={`w-full h-12 text-center border rounded text-lg font-semibold text-primary-color disabled:opacity-100 disabled:bg-gray-100 disabled:text-gray-600 ${isEditable && tableNum === currentTable && rowIndex === currentRow && colIndex === currentCol
                              ? 'border-primary-color bg-blue-50 ring-2 ring-blue-200'
                              : cell.isComplete
                                ? 'border-primary-color'
                                : 'border-gray-300'
                              }`}
                            disabled={!isEditable}
                          />
                        </div>
                      ))}
                    </div>
                  )) || Array(5).fill(null).map((_, rowIndex) => (
                    <div key={rowIndex} className="grid grid-cols-5 gap-1">
                      {Array(5).fill(null).map((_, colIndex) => (
                        <div key={colIndex} className="relative">
                          <input
                            type="text"
                            className="w-full h-12 text-center border rounded text-sm font-medium border-gray-300"
                            disabled
                          />
                        </div>
                      ))}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-5 gap-1 mt-2">
                  {[0, 1, 2, 3, 4].map((colIndex) => (
                    <div key={colIndex} className={`text-white text-center py-2 rounded text-lg font-semibold bg-gradient-to-br from-primary-color to-primary-color`}>
                      {replaceDotToComma(getColumnSum(tableNum, colIndex).toFixed(1))}
                    </div>
                  ))}
                </div>
                <div className='pt-4 pb-2 text-4xl font-bold text-primary-color text-center'>
                  {replaceDotToComma([0, 1, 2, 3, 4].reduce((acc, i) => acc + getColumnSum(tableNum, i), 0).toFixed(1))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-blue-100 rounded-lg p-4 shadow-md">
            <div className="text-center">
              <div className="text-xl font-bold text-primary-color mb-2">
                Tổng trang {currentPage}: <span className='text-[22px] font-bold'>{getPageTotalSum().toFixed(1)} kg</span>
              </div>
              <div className="text-md font-semibold text-primary-color">
                Đã nhập: {getCurrentPageCompletedCount()}/75 ô
              </div>
            </div>
          </div>

          <div className="bg-emerald-100 rounded-lg p-4 shadow-md">
            <div className="text-center">
              <div className="text-xl font-bold text-emerald-700 mb-2">
                Tổng tất cả: <span className='text-[22px] font-bold'>{getAllPagesTotal().toFixed(1)} kg</span>
              </div>
              <div className="text-md font-semibold text-emerald-800">
                Tổng đã nhập: {getCompletedCellsCount()} ô ({pagesData.length} trang)
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiceWeightInput;