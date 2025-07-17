import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';

export default function BusinessCalculator() {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState(null);
  const [operation, setOperation] = useState(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [mode, setMode] = useState('basic');
  const [expression, setExpression] = useState('');

  // Xử lý sự kiện phím
  useEffect(() => {
    const handleKeyDown = (event) => {
      event.preventDefault();

      const key = event.key;

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
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [display, previousValue, operation, waitingForOperand]);

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

  const profitResult = null;

  return (
    <div className="h-[calc(100vh-86px)] max-w-md mx-auto bg-gradient-to-br from-blue-50 to-indigo-100 p-6 flex flex-col justify-center pb-[66px]">

      <div>
        {/* Expression Display */}
        <div className="bg-gray-200 text-gray-600 text-right text-lg font-medium p-3 rounded-lg mb-2 min-h-8 flex items-center justify-end shadow-sm">
          {expression || ' '}
        </div>

        {/* Display */}
        <div className="bg-gray-900 text-white text-right font-mono p-4 rounded-lg mb-4 min-h-16 flex items-center justify-end text-3xl shadow-sm">
          {formatNumber(display)}
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-4 gap-2 text-2xl">
          <button
            onClick={clear}
            className="col-span-2 text-[16px] bg-gray-400 text-white py-3 rounded-lg font-semibold shadow-sm"
          >
            Xóa (AC)
          </button>
          <button
            onClick={backspace}
            className="bg-gray-400 text-white py-3 rounded-lg font-semibold"
          >
            <Icon icon={'carbon:delete'} fontSize={24} className='m-auto' />
          </button>
          <button
            onClick={() => performOperation('/')}
            className="bg-gray-400 shadow-sm text-white py-3 rounded-lg font-semibold "
          >
            ÷
          </button>

          {[7, 8, 9].map(num => (
            <button
              key={num}
              onClick={() => inputNumber(num)}
              className="bg-gray-100 text-gray-800 py-3 rounded-lg font-semibold shadow-sm"
            >
              {num}
            </button>
          ))}
          <button
            onClick={() => performOperation('*')}
            className="bg-gray-400 shadow-sm text-white py-3 rounded-lg font-semibold "
          >
            ×
          </button>

          {[4, 5, 6].map(num => (
            <button
              key={num}
              onClick={() => inputNumber(num)}
              className="bg-gray-100 text-gray-800 py-3 rounded-lg font-semibold shadow-sm"
            >
              {num}
            </button>
          ))}
          <button
            onClick={() => performOperation('-')}
            className="bg-gray-400 shadow-sm text-white py-3 rounded-lg font-semibold "
          >
            -
          </button>

          {[1, 2, 3].map(num => (
            <button
              key={num}
              onClick={() => inputNumber(num)}
              className="bg-gray-100 text-gray-800 py-3 rounded-lg font-semibold shadow-sm"
            >
              {num}
            </button>
          ))}
          <button
            onClick={() => performOperation('+')}
            className="bg-gray-400 shadow-sm text-white py-3 rounded-lg font-semibold "
          >
            +
          </button>

          <button
            onClick={() => inputNumber(0)}
            className="col-span-2 bg-gray-100 text-gray-800 py-3 rounded-lg font-semibold shadow-sm"
          >
            0
          </button>
          <button
            onClick={inputDecimal}
            className="bg-gray-100 text-gray-800 py-3 rounded-lg font-semibold shadow-sm"
          >
            .
          </button>
          <button
            onClick={() => performOperation('=')}
            className="bg-primary-color text-white py-3 rounded-lg font-semibold shadow-sm"
          >
            =
          </button>
        </div>
      </div>

      <div className="mt-6 text-center">
        <p className="text-sm leading-6 font-medium text-gray-600 mt-1">
          Phím tắt: 0-9, +, -, *, /, Enter (=), AC (xóa), Backspace (xóa 1 ký tự)
        </p>
      </div>
    </div>
  );
}