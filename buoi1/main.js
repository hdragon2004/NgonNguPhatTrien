// Phạm Thị Thu Hương 2280601339

// Mảng số nguyên từ 1-5
const numbers = [1, 2, 3, 4, 5];
console.log("Mảng ban đầu:", numbers);

// 1. MAP: Đưa ra kết quả là phần tử chẵn hay lẻ
console.log("1. MAP - Kiểm tra chẵn/lẻ:");
const evenOddResult = numbers.map(function(num) {
    if (num % 2 === 0) {
        return "chẵn";
    } else {
        return "lẻ";
    }
});
console.log("Kết quả:", evenOddResult);

// 2. REDUCE: Đưa ra tích của các phần tử trong mảng
console.log("2. REDUCE - Tích các phần tử:");
const product = numbers.reduce(function(acc, num) {
    return acc * num;
}, 1);
console.log("Kết quả:", product);

// 3. FILTER: Lọc ra các phần tử chẵn
console.log("3. FILTER - Các phần tử chẵn:");
const evenNumbers = numbers.filter(function(num) {
    if (num % 2 === 0) {
        return true;
    } else {
        return false;
    }
});
console.log("Kết quả:", evenNumbers);

// 4. SOME: Kiểm tra xem có phần tử nào chia hết cho 2 không
console.log("4. SOME - Có phần tử nào chia hết cho 2?");
const hasEvenNumber = numbers.some(function(num) {
    if (num % 2 === 0) {
        return true;
    } else {
        return false;
    }
});
console.log("Kết quả:", hasEvenNumber);

// 5. EVERY: Kiểm tra xem tất cả phần tử trong mảng có chia hết cho 3 hay không
console.log("5. EVERY - Tất cả phần tử có chia hết cho 3?");
const allDivisibleBy3 = numbers.every(function(num) {
    if (num % 3 === 0) {
        return true;
    } else {
        return false;
    }
});
console.log("Kết quả:", allDivisibleBy3);
