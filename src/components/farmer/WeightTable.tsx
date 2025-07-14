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

  // State để theo dõi trạng thái API
  const [apiStatus, setApiStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [apiMessage, setApiMessage] = useState('');

  // Hàm gọi API để lưu dữ liệu
  const saveWeightData = async (weightData: WeightData) => {
    setApiStatus('loading');
    
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



      setApiStatus('success');
      setApiMessage(weightData.phienCanId ? 'Cập nhật thành công' : 'Tạo mới thành công');
      
      // Tự động xóa thông báo sau 3 giây
      setTimeout(() => {
        setApiStatus('idle');
        setApiMessage('');
      }, 3000);
      
      return mockResponse; // Return result in production
    } catch (error) {
      setApiStatus('error');
      setApiMessage(`Lỗi: ${error instanceof Error ? error.message : 'Không thể kết nối API'}`);
      
      // Tự động xóa thông báo lỗi sau 5 giây
      setTimeout(() => {
        setApiStatus('idle');
        setApiMessage('');
      }, 5000);
      
      throw error;
    }
  };

  const handleInputChange = (value: string, table: number, row: number, col: number) => {
    if (!/^\d*$/.test(value)) return; // Chỉ cho phép số
    if (value.length > 3) return; // Giới hạn 3 ký tự

    const newPagesData = [...pagesData];
    const currentPageData = newPagesData[currentPage - 1];
    
    if (currentPageData) {
      const currentCell = currentPageData[table - 1][row][col];
      
      currentPageData[table - 1][row][col].value = value;
      
      // Đánh dấu ô đã hoàn thành nếu đã nhập đủ 3 ký tự
      if (value.length === 3) {
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
        
        // Gọi API và lưu phienCanId trả về
        // saveWeightData(weightData).then(response => {
        //   if (response && response.data && response.data.phienCanId) {
        //     // Cập nhật phienCanId vào cell data
        //     const updatedPagesData = [...pagesData];
        //     setPagesData(updatedPagesData);
        //   }
        // }).catch(error => {
        //   console.error('Lỗi khi lưu dữ liệu:', error);
        // });
        
        moveToNextCell();
      } else {
        setPagesData(newPagesData);
      }
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

  const handleKeyDown = (e: React.KeyboardEvent, table: number, row: number, col: number) => {
    if (e.key === 'Enter' || e.key === 'Tab') {
      e.preventDefault();
      const currentPageData = getCurrentPageData();
      const currentCell = currentPageData[table - 1]?.[row]?.[col];
      
      if (currentCell && currentCell.value) {
        const newPagesData = [...pagesData];
        newPagesData[currentPage - 1][table - 1][row][col].isComplete = true;
        setPagesData(newPagesData);
        
        // Chuẩn bị dữ liệu API
        const weightData: WeightData = {
          trongLuong: parseInt(currentCell.value),
          viTriTrang: currentPage,
          viTriBang: table,
          viTriCot: col + 1,
          viTriDong: row + 1
        };

        saveWeightData(weightData);
        
        // Gọi API và lưu phienCanId trả về
        // saveWeightData(weightData).then(response => {
        //   if (response && response.data && response.data.phienCanId) {
        //     // Cập nhật phienCanId vào cell data
        //     const updatedPagesData = [...pagesData];
        //     setPagesData(updatedPagesData);
        //   }
        // }).catch(error => {
        //   console.error('Lỗi khi lưu dữ liệu:', error);
        // });
        
        moveToNextCell();
      }
    }
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

  const getCurrentApiData = (): WeightData => {
    const currentPageData = getCurrentPageData();
    const currentCell = currentPageData[currentTable - 1]?.[currentRow]?.[currentCol];
    
    const apiData: WeightData = {
      trongLuong: currentCell?.value ? parseInt(currentCell.value) : 0,
      viTriTrang: currentPage,
      viTriBang: currentTable,
      viTriCot: currentCol + 1,
      viTriDong: currentRow + 1
    };

    // // Luôn thêm phienCanId nếu có
    // if (currentCell?.phienCanId) {
    //   apiData.phienCanId = currentCell.phienCanId;
    // }

    return apiData;
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
        <div className="flex flex-col justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Nhập liệu cân lúa</h1>
          <div className="text-lg font-medium text-gray-600">
            Trang {currentPage} - Bảng {currentTable} - Ô ({currentRow + 1}, {currentCol + 1})
          </div>
        </div>

        {/* API Status Indicator */}
        {apiStatus !== 'idle' && (
          <div className={`mb-4 p-3 rounded-lg text-sm font-medium hidden ${
            apiStatus === 'loading' ? 'bg-yellow-100 text-yellow-800' :
            apiStatus === 'success' ? 'bg-green-100 text-green-800' :
            'bg-red-100 text-red-800'
          }`}>
            {/* {apiStatus === 'loading' && (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-yellow-800 border-t-transparent rounded-full animate-spin"></div>
                Đang lưu dữ liệu...
              </div>
            )}
            {apiStatus === 'success' && (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                {apiMessage}
              </div>
            )} */}
            {apiStatus === 'error' && (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                {apiMessage}
              </div>
            )}
          </div>
        )}

        {/* Page Navigation */}
        <div className="flex items-center gap-2 mb-6">
          <span className="text-sm font-medium text-gray-700">Trang:</span>
          {Array.from({ length: Math.max(currentPage, pagesData.length) }, (_, i) => i + 1).map(pageNum => (
            <button
              key={pageNum}
              onClick={() => goToPage(pageNum)}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                pageNum === currentPage
                  ? 'bg-[#74b4da] text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {pageNum}
            </button>
          ))}
          {/* <button
            onClick={() => goToPage(currentPage + 1)}
            className="px-3 py-1 rounded text-sm font-medium bg-green-500 text-white hover:bg-green-600"
          >
            + Trang mới
          </button> */}
        </div>

        <div className="space-y-6 mb-6">
          {[1, 2, 3].map((tableNum) => (
            <div key={tableNum} className={`bg-white border rounded-lg overflow-hidden transition-all duration-300 ${
              tableNum <= currentTable ? 'opacity-100' : 'opacity-50'
            }`}>
              <div className={`px-4 py-2 text-lg text-center font-semibold text-white ${
                tableNum === currentTable ? 'bg-[#74b4da]' : 'bg-gray-400'
              }`}>
                BẢNG {tableNum} - TRANG {currentPage}
              </div>
              
              <div className="p-4">
                <div className="grid grid-cols-5 gap-1 mb-2">
                  {['C1', 'C2', 'C3', 'C4', 'C5'].map((col, colIndex) => (
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
                            ref={(el) => {
                              if (inputRefs.current[tableNum - 1]) {
                                inputRefs.current[tableNum - 1][rowIndex][colIndex] = el;
                              }
                            }}
                            type="text"
                            value={cell.value}
                            onChange={(e) => handleInputChange(e.target.value, tableNum, rowIndex, colIndex)}
                            onKeyDown={(e) => handleKeyDown(e, tableNum, rowIndex, colIndex)}
                            maxLength={3}
                            className={`w-full h-12 text-center border rounded text-sm font-medium ${
                              tableNum === currentTable && rowIndex === currentRow && colIndex === currentCol
                                ? 'border[#74b4da] bg-blue-50 ring-2 ring-blue-200'
                                : cell.isComplete
                                ? 'border-green-500 bg-green-50'
                                : 'border-gray-300'
                            }`}
                            disabled={tableNum !== currentTable}
                          />
                          {/* {cell.isComplete && (
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"></div>
                          )} */}
                          {/* {cell.value && (
                            <div className="absolute -bottom-6 left-0 right-0 text-xs text-center text-gray-600">
                              {cell.value}
                            </div>
                          )} */}
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
                  <div key={colIndex} className="bg-[#74b4da] text-white text-center py-2 rounded text-sm font-medium">
                      {getColumnSum(tableNum, colIndex).toFixed(1)}
                    </div>
                  ))}
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
              <div className="text-sm text-blue-700">
                Đã nhập: {getCurrentPageCompletedCount()}/75 ô
              </div>
            </div>
          </div>
          
          <div className="bg-red-100 rounded-lg p-4">
            <div className="text-center">
              <div className="text-xl font-bold text-red-600 mb-2">
                Tổng tất cả: {getAllPagesTotal().toFixed(1)}
              </div>
              <div className="text-sm text-red-700">
                Tổng đã nhập: {getCompletedCellsCount()} ô ({pagesData.length} trang)
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 text-sm text-gray-600">
          <div className='text-[16px]'><strong>Hướng dẫn:</strong></div>
          <ul className="list-disc ml-4 mt-2 space-y-1">
            <li>Mỗi trang có 3 bảng, mỗi bảng có 25 ô (5x5)</li>
            <li>Nhập một số tối đa 3 chữ số vào mỗi ô</li>
            <li>Tự động chuyển sang ô tiếp theo khi nhập đủ 3 chữ số hoặc nhấn Enter/Tab</li>
            <li>Di chuyển theo chiều dọc: C1 (dòng 1→5), C2 (dòng 1→5), ..., C5 (dòng 1→5)</li>
            <li>Hoàn thành bảng 1 → bảng 2 → bảng 3 → trang tiếp theo</li>
            {/* <li>Có thể chuyển trang bằng cách nhấn vào số trang hoặc "Trang mới"</li> */}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RiceWeightInput;