/**
 * Парсит CSV-файл и возвращает среднее значение по колонке 'score'
 * 
 * @param {string} csvContent - Содержимое CSV-файла в виде строки
 * @returns {number} - Среднее значение по колонке 'score'
 * @throws {Error} - Если колонка 'score' не найдена или нет данных
 */
function calculateAverageScore(csvContent) {
    // Разбиваем CSV на строки
    const lines = csvContent.trim().split('\n');
    
    // Проверяем, что есть хотя бы заголовок
    if (lines.length === 0) {
        throw new Error('CSV файл пуст');
    }
    
    // Парсим заголовки (первая строка)
    const headers = lines[0].split(',').map(header => header.trim());
    
    // Находим индекс колонки 'score'
    const scoreIndex = headers.indexOf('score');
    
    if (scoreIndex === -1) {
        throw new Error('Колонка "score" не найдена в CSV файле');
    }
    
    // Собираем все значения из колонки 'score' (начиная со второй строки)
    const scores = [];
    
    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(value => value.trim());
        
        // Пропускаем пустые строки
        if (values.length === 0 || values.every(v => v === '')) {
            continue;
        }
        
        // Получаем значение score и преобразуем в число
        const scoreValue = values[scoreIndex];
        
        if (scoreValue !== undefined && scoreValue !== '') {
            const numericScore = parseFloat(scoreValue);
            
            // Проверяем, что значение является валидным числом
            if (!isNaN(numericScore)) {
                scores.push(numericScore);
            }
        }
    }
    
    // Проверяем, что есть хотя бы одно значение
    if (scores.length === 0) {
        throw new Error('Не найдено валидных значений в колонке "score"');
    }
    
    // Вычисляем среднее значение
    const sum = scores.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    const average = sum / scores.length;
    
    return average;
}

/**
 * Асинхронная версия для чтения CSV из файла (Node.js)
 * 
 * @param {string} filePath - Путь к CSV-файлу
 * @returns {Promise<number>} - Промис, который разрешается со средним значением
 */
async function calculateAverageScoreFromFile(filePath) {
    const fs = require('fs').promises;
    const csvContent = await fs.readFile(filePath, 'utf-8');
    return calculateAverageScore(csvContent);
}

// Пример использования:
const exampleCSV = `name,score,age
Иван,85,25
Мария,92,23
Петр,78,30
Анна,95,22
Дмитрий,88,28`;

try {
    const average = calculateAverageScore(exampleCSV);
    console.log(`Среднее значение score: ${average.toFixed(2)}`);
} catch (error) {
    console.error('Ошибка:', error.message);
}

// Экспорт функций для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        calculateAverageScore,
        calculateAverageScoreFromFile
    };
}
