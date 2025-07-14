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
  const [currentPage, setCurrentPage] = useState(1);
  const [currentTable, setCurrentTable] = useState(1);
  const [currentRow, setCurrentRow] = useState(0);
  const [currentCol, setCurrentCol] = useState(0);
  const limitInput = 1;

  // Khởi tạo dữ liệu cho nhiều trang, mỗi trang có 3 bảng, mỗi bảng 5x5 ô
  const [pagesData, setPagesData] = useState<CellData[][][][]>(() => {
    const initData: CellData[][][][] = [];
    // Khởi tạo trang đầu tiên
    const firstPage: CellData[][][] = [];
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
      firstPage.push(tableRows);
    }
    initData.push(firstPage);
    return initData;
  });

  const inputRefs = useRef<(HTMLInputElement | null)[][][]>([]);

  // Khởi tạo refs cho trang hiện tại
  useEffect(() => {
    inputRefs.current = Array(3).fill(null).map(() =>
      Array(5).fill(null).map(() => Array(5).fill(null))
    );
  }, [currentPage]);

  // Focus vào ô input hiện tại
  useEffect(() => {
    const currentInput = inputRefs.current[currentTable - 1]?.[currentRow]?.[currentCol];
    if (currentInput) {
      console.log(currentRow, currentCol, currentTable, currentPage);
      currentInput.focus();
    }
  }, [currentTable, currentRow, currentCol]);

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
    if (value.length > limitInput) return; // Giới hạn 3 ký tự

    const newPagesData = [...pagesData];
    const currentPageData = newPagesData[currentPage - 1];

    if (currentPageData) {
      const currentCell = currentPageData[table - 1][row][col];

      currentPageData[table - 1][row][col].value = value;

      // Đánh dấu ô đã hoàn thành nếu đã nhập đủ 3 ký tự
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
        setPagesData(newPagesData);
      }
    }
  };

  const handleInputFocus = (page: number, table: number, row: number, col: number) => {
    setCurrentPage(page);
    setCurrentTable(table);
    setCurrentRow(row);
    setCurrentCol(col);
  }

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
        if (nextTable > 3) {
          nextTable = 1;
          nextPage = currentPage + 1;

          // Tạo trang mới nếu cần
          ensurePageExists(nextPage - 1);
        }
      }
    }

    setCurrentCol(nextCol);
    setCurrentRow(nextRow);
    setCurrentTable(nextTable);
    setCurrentPage(nextPage);
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

  return (
    <div className="max-w-4xl mx-auto bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-lg p-3">

        {/* Page Navigation */}
        <div className="flex items-center gap-2 mb-6">
          <span className="text-md font-medium text-gray-700">Trang:</span>
          {Array.from({ length: Math.max(currentPage, pagesData.length) }, (_, i) => i + 1).map(pageNum => (
            <button
              key={pageNum}
              onClick={() => goToPage(pageNum)}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${pageNum === currentPage
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
            <div key={tableNum} className={`bg-white border rounded-lg overflow-hidden transition-all duration-300 ${tableNum <= currentTable ? 'opacity-100' : 'opacity-100'
              }`}>
              <div className={`px-4 py-3 text-xl text-center font-semibold text-white ${tableNum === currentTable ? 'bg-[#74b4da]' : 'bg-gray-400'
                }`}>
                Bảng {tableNum} - Trang {currentPage}
              </div>

              <div className="px-1 py-2">
                <div className="grid grid-cols-5 gap-1 mb-1">
                  {['C1', 'C2', 'C3', 'C4', 'C5'].map((col) => (
                    <div key={col} className="text-center text-md font-semibold text-primary-color py-1">
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
                              }
                            }}
                            onClick={() => handleInputFocus(currentPage, tableNum, rowIndex, colIndex)}
                            onFocus={(e) => e.target.select()}
                            type="text"
                            value={cell.value}
                            onChange={(e) => handleInputChange(e.target.value, tableNum, rowIndex, colIndex)}
                            maxLength={3}
                            className={`w-full h-12 text-center border rounded text-lg font-semibold ${tableNum === currentTable && rowIndex === currentRow && colIndex === currentCol
                              ? 'border[#74b4da] bg-blue-50 ring-2 ring-blue-200'
                              : cell.isComplete
                                ? 'border-green-500 bg-green-50'
                                : 'border-gray-300'
                              }`}
                          // disabled={tableNum !== currentTable}
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
                    <div key={colIndex} className={`text-white text-center py-2 rounded text-lg font-semibold ${tableNum === currentTable ? 'bg-[#74b4da]' : 'bg-gray-400'
                      }`}>
                      {getColumnSum(tableNum, colIndex).toFixed(1)}
                    </div>
                  ))}
                </div>
                <div className='pt-3 text-4xl font-bold text-blue-700 text-center'>
                  {[0, 1, 2, 3, 4].reduce((acc, i) => acc + getColumnSum(tableNum, i), 0).toFixed(1)}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-blue-100 rounded-lg p-4">
            <div className="text-center">
              <div className="text-xl font-bold text-blue-600 mb-2">
                Tổng trang {currentPage}: {getPageTotalSum().toFixed(1)}
              </div>
              <div className="text-md font-medium text-blue-700">
                Đã nhập: {getCurrentPageCompletedCount()}/75 ô
              </div>
            </div>
          </div>

          <div className="bg-green-100 rounded-lg p-4">
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