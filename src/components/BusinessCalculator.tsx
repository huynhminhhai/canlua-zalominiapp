import { Icon } from '@iconify/react';
import React, { useState, useEffect } from 'react';

export default function BusinessCalculator() {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState(null);
  const [operation, setOperation] = useState(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [expression, setExpression] = useState('');
  const [isExpressionMode, setIsExpressionMode] = useState(true);

  // Hàm đánh giá biểu thức toán học
  const evaluateExpression = (expr) => {
    try {
      // Thay thế các ký tự hiển thị bằng ký tự tính toán
      const cleanExpr = expr.replace(/×/g, '*').replace(/÷/g, '/');

      // Kiểm tra biểu thức hợp lệ (chỉ chứa số, toán tử, dấu chấm, dấu ngoặc)
      if (!/^[0-9+\-*/().\s]+$/.test(cleanExpr)) {
        return 'Error';
      }

      // Sử dụng Function constructor để tính toán an toàn
      const result = Function('"use strict"; return (' + cleanExpr + ')')();

      if (isNaN(result) || !isFinite(result)) {
        return 'Error';
      }

      return result;
    } catch (error) {
      return 'Error';
    }
  };

  // Xử lý sự kiện phím
  useEffect(() => {
    const handleKeyDown = (event) => {
      event.preventDefault();

      const key = event.key;

      if (isExpressionMode) {
        // Trong chế độ expression, cho phép nhập trực tiếp
        if (key >= '0' && key <= '9') {
          inputToExpression(key);
        } else if (key === '.') {
          inputToExpression('.');
        } else if (key === '+') {
          inputToExpression('+');
        } else if (key === '-') {
          inputToExpression('-');
        } else if (key === '*') {
          inputToExpression('×');
        } else if (key === '/') {
          inputToExpression('÷');
        } else if (key === '(' || key === ')') {
          inputToExpression(key);
        } else if (key === 'Enter' || key === '=') {
          calculateExpression();
        } else if (key === 'Escape' || key === 'c' || key === 'C') {
          clear();
        } else if (key === 'Backspace') {
          backspaceExpression();
        }
      } else {
        // Chế độ calculator thông thường
        if (key >= '0' && key <= '9') {
          inputNumber(parseInt(key));
        } else if (key === '.') {
          inputDecimal();
        } else if (key === '+') {
          performOperation('+');
        } else if (key === '-') {
          performOperation('-');
        } else if (key === '*') {
          performOperation('*');
        } else if (key === '/') {
          performOperation('/');
        } else if (key === 'Enter' || key === '=') {
          performOperation('=');
        } else if (key === 'Escape' || key === 'c' || key === 'C') {
          clear();
        } else if (key === 'Backspace') {
          backspace();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [display, previousValue, operation, waitingForOperand, isExpressionMode, expression]);

  const inputToExpression = (value) => {
    if (expression === '0' || expression === 'Error') {
      setExpression(value);
    } else {
      setExpression(expression + value);
    }
  };

  const backspaceExpression = () => {
    if (expression.length > 1) {
      setExpression(expression.slice(0, -1));
    } else {
      setExpression('0');
    }
  };

  const calculateExpression = () => {
    const result = evaluateExpression(expression);
    if (result === 'Error') {
      setDisplay('Error');
      setExpression('Error');
    } else {
      setDisplay(String(result));
      setExpression(String(result));
    }
  };

  const switchMode = () => {
    setIsExpressionMode(!isExpressionMode);
    clear();
  };

  const backspace = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  };

  const inputNumber = (num) => {
    if (waitingForOperand) {
      setDisplay(String(num));
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? String(num) : display + num);
    }
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };

  const clear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
    setExpression('');
  };

  const performOperation = (nextOperation) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue as any);
      setExpression(`${display} ${getOperationSymbol(nextOperation)}`);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operation);

      setDisplay(String(newValue));
      setPreviousValue(newValue);

      if (nextOperation === '=') {
        setExpression(`${expression} ${display} = ${newValue}`);
      } else {
        setExpression(`${newValue} ${getOperationSymbol(nextOperation)}`);
      }
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const getOperationSymbol = (op) => {
    switch (op) {
      case '+':
        return '+';
      case '-':
        return '-';
      case '*':
        return '×';
      case '/':
        return '÷';
      default:
        return '';
    }
  };

  const calculate = (firstValue, secondValue, operation) => {
    switch (operation) {
      case '+':
        return firstValue + secondValue;
      case '-':
        return firstValue - secondValue;
      case '*':
        return firstValue * secondValue;
      case '/':
        return firstValue / secondValue;
      case '=':
        return secondValue;
      default:
        return secondValue;
    }
  };

  const formatNumber = (num) => {
    return num;
  };

  return (
    <div className="h-[calc(100vh-86px)] w-full mx-auto bg-gradient-to-br from-blue-50 to-indigo-100 p-6 flex flex-col justify-center pb-[66px]">
      {/* Mode Toggle */}
      {/* <div className="mb-4 text-center">
          <button
            onClick={switchMode}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold shadow-sm hover:bg-blue-600 transition-colors"
          >
            {isExpressionMode ? 'Chế độ Calculator' : 'Chế độ Expression'}
          </button>
        </div> */}

      {/* Expression Display */}
      {/* <div className="bg-gray-200 text-gray-600 text-right text-lg font-medium p-3 rounded-lg mb-2 min-h-8 flex items-center justify-end shadow-sm">
          {isExpressionMode ? (expression || '0') : (expression || ' ')}
        </div> */}

      {/* Display */}
      <div className="bg-gray-900 text-white text-right font-mono px-4 py-6 rounded-lg mb-4 min-h-16 flex items-center text-3xl shadow-sm justify-end">
        {/* {formatNumber(display)} */}
        {isExpressionMode ? (expression || '0') : (expression || ' ')}
      </div>

      {/* Buttons */}
      <div className="grid grid-cols-4 gap-2 text-2xl">
        <button
          onClick={clear}
          className="col-span-2 text-[16px] bg-blue-300 text-white py-3 rounded-lg font-semibold shadow-sm"
        >
          Xóa (AC)
        </button>
        <button
          onClick={isExpressionMode ? backspaceExpression : backspace}
          className="bg-blue-300 text-white py-3 rounded-lg font-semibold"
        >
          <Icon icon={"carbon:delete"} fontSize={24} className='m-auto' />
        </button>
        <button
          onClick={() => isExpressionMode ? inputToExpression('÷') : performOperation('/')}
          className="bg-blue-300 shadow-sm text-white py-3 rounded-lg font-semibold "
        >
          ÷
        </button>

        {[7, 8, 9].map(num => (
          <button
            key={num}
            onClick={() => isExpressionMode ? inputToExpression(String(num)) : inputNumber(num)}
            className="bg-gray-50 text-gray-800 py-3 rounded-lg font-semibold shadow-sm"
          >
            {num}
          </button>
        ))}
        <button
          onClick={() => isExpressionMode ? inputToExpression('×') : performOperation('*')}
          className="bg-blue-300 shadow-sm text-white py-3 rounded-lg font-semibold "
        >
          ×
        </button>

        {[4, 5, 6].map(num => (
          <button
            key={num}
            onClick={() => isExpressionMode ? inputToExpression(String(num)) : inputNumber(num)}
            className="bg-gray-50 text-gray-800 py-3 rounded-lg font-semibold shadow-sm"
          >
            {num}
          </button>
        ))}
        <button
          onClick={() => isExpressionMode ? inputToExpression('-') : performOperation('-')}
          className="bg-blue-300 shadow-sm text-white py-3 rounded-lg font-semibold "
        >
          -
        </button>

        {[1, 2, 3].map(num => (
          <button
            key={num}
            onClick={() => isExpressionMode ? inputToExpression(String(num)) : inputNumber(num)}
            className="bg-gray-50 text-gray-800 py-3 rounded-lg font-semibold shadow-sm"
          >
            {num}
          </button>
        ))}
        <button
          onClick={() => isExpressionMode ? inputToExpression('+') : performOperation('+')}
          className="bg-blue-300 shadow-sm text-white py-3 rounded-lg font-semibold "
        >
          +
        </button>

        <button
          onClick={() => isExpressionMode ? inputToExpression('0') : inputNumber(0)}
          className="col-span-2 bg-gray-50 text-gray-800 py-3 rounded-lg font-semibold shadow-sm"
        >
          0
        </button>
        <button
          onClick={() => isExpressionMode ? inputToExpression('.') : inputDecimal()}
          className="bg-gray-50 text-gray-800 py-3 rounded-lg font-semibold shadow-sm"
        >
          .
        </button>
        <button
          onClick={() => isExpressionMode ? calculateExpression() : performOperation('=')}
          className="bg-blue-300 text-white py-3 rounded-lg font-semibold shadow-sm"
        >
          =
        </button>
      </div>
      {/* Parentheses buttons in expression mode */}
      {isExpressionMode && (
        <div className="grid grid-cols-2 gap-2 mt-2">
          <button
            onClick={() => inputToExpression('(')}
            className="bg-gray-50 text-gray-800 text-lg py-3 rounded-lg font-semibold shadow-sm"
          >
            (
          </button>
          <button
            onClick={() => inputToExpression(')')}
            className="bg-gray-50 text-gray-800 text-lg py-3 rounded-lg font-semibold shadow-sm"
          >
            )
          </button>
        </div>
      )}
      <div className="mt-6 text-center">
        <p className="text-sm leading-6 font-medium text-gray-600 mt-1">
          Nhập biểu thức như "2+3*4" hoặc "(5+3)*2" <br /> Bấm = để tính
        </p>
      </div>
    </div>
  );
}