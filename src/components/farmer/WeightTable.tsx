import { Icon } from '@iconify/react';
import React, { useState, useRef, useEffect } from 'react';

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

  const [isEditable, setIsEditable] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentTable, setCurrentTable] = useState(1);
  const [currentRow, setCurrentRow] = useState(0);
  const [currentCol, setCurrentCol] = useState(0);
  const limitInput = 2;
  const numberOfTables = 3;

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

  // Khởi tạo refs cho trang hiện tại
  useEffect(() => {
    inputRefs.current = Array(numberOfTables).fill(null).map(() =>
      Array(5).fill(null).map(() => Array(5).fill(null))
    );
  }, [currentPage]);

  // Focus vào ô input hiện tại
  // useEffect(() => {
  //   const timeout = setTimeout(() => {
  //     const currentInput = inputRefs.current[currentTable - 1]?.[currentRow]?.[currentCol];
  //     console.log(currentInput);
  //     if (currentInput) {
  //       currentInput.focus();
  //     }
  //   }, 5000);

  //   return () => clearTimeout(timeout);
  // }, [currentPage, currentTable, currentRow, currentCol, pagesData]);

  // Tạo trang mới nếu chưa tồn tại
  const ensurePageExists = (pageIndex: number) => {
    if (!pagesData[pageIndex]) {
      const newPagesData = [...pagesData];
      const newPage: CellData[][][] = [];

      for (let table = 0; table < 3; table++) {
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

    // Simulate API call - remove this in production
    console.log('🚀 Calling API with data:', weightData);

    try {
      // Giả lập API call
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay

      // Giả lập response từ API
      const mockResponse = {
        success: true,
        data: {
          // phienCanId: weightData.phienCanId || Math.floor(Math.random() * 10000) + 1000, // Use existing ID or generate new one
          trongLuong: weightData.trongLuong,
          viTriTrang: weightData.viTriTrang,
          viTriBang: weightData.viTriBang,
          viTriCot: weightData.viTriCot,
          viTriDong: weightData.viTriDong
        }
      };

      return mockResponse; // Return result in production
    } catch (error) {
      console.error('Error calling API:', error);
      throw error;
    }
  };

  const handleInputChange = (value: string, table: number, row: number, col: number) => {
    if (!/^\d*$/.test(value)) return; // Chỉ cho phép số
    if (value.length > limitInput) return;

    const newPagesData = [...pagesData];
    const currentPageData = newPagesData[currentPage - 1];

    if (currentPageData) {
      // const currentCell = currentPageData[table - 1][row][col];

      currentPageData[table - 1][row][col].value = value;

      // Đánh dấu ô đã hoàn thành nếu đã nhập đủ ký tự
      if (value.length === limitInput) {
        currentPageData[table - 1][row][col].isComplete = true;
        setPagesData(newPagesData);

        // Chuẩn bị dữ liệu API
        const weightData: WeightData = {
          trongLuong: parseInt(value),
          viTriTrang: currentPage,
          viTriBang: table,
          viTriCot: col + 1,
          viTriDong: row + 1
        };

        saveWeightData(weightData);

        moveToNextCell();
      } else {
        currentPageData[table - 1][row][col].isComplete = false;
        setPagesData(newPagesData);
      }
    }
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

  const getColumnSum = (table: number, col: number) => {
    const currentPageData = getCurrentPageData();
    if (!currentPageData[table - 1]) return 0;

    return currentPageData[table - 1].reduce((sum, row) => {
      const cellValue = parseInt(row[col].value) || 0;
      return sum + cellValue;
    }, 0);
  };

  const getPageTotalSum = () => {
    const currentPageData = getCurrentPageData();
    return currentPageData.reduce((total, table) =>
      total + table.reduce((tableSum, row) =>
        tableSum + row.reduce((rowSum, cell) => {
          const cellValue = parseInt(cell.value) || 0;
          return rowSum + cellValue;
        }, 0), 0), 0);
  };

  const getAllPagesTotal = () => {
    return pagesData.reduce((grandTotal, page) =>
      grandTotal + page.reduce((pageTotal, table) =>
        pageTotal + table.reduce((tableSum, row) =>
          tableSum + row.reduce((rowSum, cell) => {
            const cellValue = parseInt(cell.value) || 0;
            return rowSum + cellValue;
          }, 0), 0), 0), 0);
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

  // const handleToggleEditable = () => {
  //   setIsEditable(!isEditable);

  //   setTimeout(() => {
  //     const currentInput = inputRefs.current[currentTable - 1]?.[currentRow]?.[currentCol];
  //     currentInput?.focus();
  //   }, 0);
  // };

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

  return (
    <div className="max-w-4xl mx-auto bg-gray-50 min-h-screen">
      <div className="rounded-lg shadow-lg p-3">
        <input
          ref={hiddenInputRef}
          className="absolute opacity-0 w-0 h-0"
          type="text"
        />
        <div className='flex items-center justify-center mb-3'>
          <button
            onClick={handleFocusTrick}
            className="px-6 py-3 bg-white text-[16px] text-primary-color border-primary-color border rounded-lg font-semibold mx-auto mb-3 flex items-center gap-2 shadow-md"
          >
            <span>
              {isEditable ? 'Chuyển sang chế độ xem' : 'Bắt đầu nhập số cân'}
            </span>
            <Icon icon={isEditable ? 'mdi:lock-outline' : 'mdi:lock-open-outline'} fontSize={18} />
          </button>
        </div>

        {/* Page Navigation */}
        <div className="flex items-center gap-2 mb-6">
          <span className="text-md font-medium text-gray-700">Trang:</span>
          {Array.from({ length: Math.max(currentPage, pagesData.length) }, (_, i) => i + 1).map(pageNum => (
            <button
              key={pageNum}
              onClick={() => goToPage(pageNum)}
              className={`shawow-md px-3 py-1 rounded text-sm font-medium transition-colors ${pageNum === currentPage
                ? 'bg-[#74b4da] text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
            >
              {pageNum}
            </button>
          ))}
        </div>

        <div className="space-y-6 mb-6">
          {[1, 2, 3].map((tableNum) => (
            <div key={tableNum} className={`bg-white border rounded-lg overflow-hidden transition-all duration-300 shadow-md`}>
              <div className={`px-4 py-3 text-lg text-center font-semibold text-white bg-[#74b4da]`}>
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
                            // ref={(el) => {
                            //   if (inputRefs.current[tableNum - 1]) {
                            //     inputRefs.current[tableNum - 1][rowIndex][colIndex] = el;
                            //   }
                            // }}
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
                            value={cell.value}
                            onInput={(e) => handleInputChange((e.target as HTMLInputElement).value, tableNum, rowIndex, colIndex)}
                            maxLength={limitInput}
                            className={`w-full h-12 text-center border rounded text-lg font-semibold text-primary-color disabled:opacity-100 disabled:bg-gray-100 ${isEditable && tableNum === currentTable && rowIndex === currentRow && colIndex === currentCol
                              ? 'border-[#74b4da] bg-blue-50 ring-2 ring-blue-200'
                              : cell.isComplete
                                ? 'border-green-500 bg-green-50'
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

                <div className="grid grid-cols-5 gap-1 mt-2 pt-2 border-t">
                  {[0, 1, 2, 3, 4].map((colIndex) => (
                    <div key={colIndex} className={`text-white text-center py-2 rounded text-lg font-semibold bg-[#74b4da]`}>
                      {getColumnSum(tableNum, colIndex).toFixed(1)}
                    </div>
                  ))}
                </div>
                <div className='pt-4 pb-2 text-4xl font-bold text-blue-900 text-center'>
                  {[0, 1, 2, 3, 4].reduce((acc, i) => acc + getColumnSum(tableNum, i), 0).toFixed(1)}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-blue-100 rounded-lg p-4 shadow-md">
            <div className="text-center">
              <div className="text-xl font-bold text-blue-600 mb-2">
                Tổng trang {currentPage}: {getPageTotalSum().toFixed(1)}
              </div>
              <div className="text-md font-medium text-blue-700">
                Đã nhập: {getCurrentPageCompletedCount()}/75 ô
              </div>
            </div>
          </div>

          <div className="bg-green-100 rounded-lg p-4 shadow-md">
            <div className="text-center">
              <div className="text-xl font-bold text-green-700 mb-2">
                Tổng tất cả: {getAllPagesTotal().toFixed(1)}
              </div>
              <div className="text-md font-medium text-green-800">
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