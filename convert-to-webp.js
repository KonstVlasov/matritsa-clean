const fs = require('fs');
const path = require('path');
const imagemin = require('imagemin');
const imageminWebp = require('imagemin-webp');
const { promisify } = require('util');
const glob = promisify(require('glob'));

/**
 * Скрипт для конвертации JPG, JPEG и PNG изображений в формат WebP
 * Сохраняет WebP версии в тех же папках с тем же именем, но с расширением .webp
 */

// Директории, которые нужно исключить из поиска
const excludeDirs = [
  'node_modules', 
  'dist', 
  'build', 
  'temp', 
  'u2865078/data/www/app/backend' // Исключаем папку backend
];

// Функция для конвертации изображения в WebP
async function convertToWebp(filePath) {
  try {
    // Проверяем, не находится ли файл в исключенных директориях
    if (excludeDirs.some(dir => filePath.includes(dir))) {
      console.log(`⏭️ Пропускаю (исключенная директория): ${filePath}`);
      return {
        file: filePath,
        skipped: true,
        reason: 'excluded_directory'
      };
    }
    
    const dir = path.dirname(filePath);
    const fileNameWithoutExt = path.basename(filePath, path.extname(filePath));
    const ext = path.extname(filePath).toLowerCase();
    const webpFileName = `${fileNameWithoutExt}.webp`;
    const webpFilePath = path.join(dir, webpFileName);
    
    console.log(`Конвертирую: ${filePath} -> ${webpFileName}`);
    
    // Получаем размер исходного файла
    const originalSize = fs.statSync(filePath).size;
    
    // Создаем временную директорию для конвертированного файла
    const tempDir = path.join(dir, '.temp_webp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    
    // Настройки качества в зависимости от типа файла
    let quality = 80; // Значение по умолчанию
    
    if (ext === '.png') {
      // Для PNG используем более высокое качество, чтобы сохранить прозрачность
      quality = 85;
    } else if (ext === '.jpg' || ext === '.jpeg') {
      // Для JPEG можно использовать более низкое качество
      quality = 75;
    }
    
    try {
      // Конвертируем изображение в WebP
      await imagemin([filePath], {
        destination: tempDir,
        plugins: [
          imageminWebp({
            quality: quality,
            method: 6, // 0-6, где 6 - самое медленное, но наиболее эффективное сжатие
            lossless: ext === '.png', // Используем lossless для PNG, чтобы сохранить прозрачность
            metadata: 'none' // Удаляем метаданные для уменьшения размера
          })
        ]
      });
      
      // Путь к временному WebP файлу
      const tempWebpFilePath = path.join(tempDir, `${path.basename(filePath)}.webp`);
      
      // Проверяем, был ли создан файл
      if (!fs.existsSync(tempWebpFilePath)) {
        throw new Error('Файл WebP не был создан');
      }
      
      // Перемещаем файл в целевую директорию с правильным именем
      fs.copyFileSync(tempWebpFilePath, webpFilePath);
      
      // Получаем размер WebP файла
      const webpSize = fs.statSync(webpFilePath).size;
      const savings = originalSize - webpSize;
      const percentage = (savings / originalSize * 100).toFixed(2);
      
      console.log(`✅ Готово: ${webpFilePath}`);
      console.log(`   Исходный размер: ${(originalSize / 1024).toFixed(2)} KB`);
      console.log(`   Размер WebP: ${(webpSize / 1024).toFixed(2)} KB`);
      console.log(`   Экономия: ${(savings / 1024).toFixed(2)} KB (${percentage}%)`);
      
      // Удаляем временные файлы
      fs.rmSync(tempDir, { recursive: true, force: true });
      
      return {
        file: filePath,
        webpFile: webpFilePath,
        originalSize,
        webpSize,
        savings,
        percentage
      };
    } catch (conversionError) {
      // Удаляем временные файлы в случае ошибки
      if (fs.existsSync(tempDir)) {
        fs.rmSync(tempDir, { recursive: true, force: true });
      }
      
      // Пробуем альтернативный метод конвертации для проблемных файлов
      console.log(`⚠️ Ошибка при стандартной конвертации, пробую альтернативный метод для: ${filePath}`);
      
      try {
        // Используем более простые настройки для проблемных файлов
        await imagemin([filePath], {
          destination: path.dirname(webpFilePath),
          plugins: [
            imageminWebp({
              quality: quality,
              method: 4, // Менее агрессивный метод
              lossless: false, // Отключаем lossless даже для PNG
              metadata: 'none'
            })
          ]
        });
        
        // Переименовываем файл, если он был создан с неправильным именем
        const possibleTempPath = path.join(path.dirname(webpFilePath), `${path.basename(filePath)}.webp`);
        if (fs.existsSync(possibleTempPath) && possibleTempPath !== webpFilePath) {
          fs.renameSync(possibleTempPath, webpFilePath);
        }
        
        if (fs.existsSync(webpFilePath)) {
          const webpSize = fs.statSync(webpFilePath).size;
          const savings = originalSize - webpSize;
          const percentage = (savings / originalSize * 100).toFixed(2);
          
          console.log(`✅ Готово (альтернативный метод): ${webpFilePath}`);
          console.log(`   Исходный размер: ${(originalSize / 1024).toFixed(2)} KB`);
          console.log(`   Размер WebP: ${(webpSize / 1024).toFixed(2)} KB`);
          console.log(`   Экономия: ${(savings / 1024).toFixed(2)} KB (${percentage}%)`);
          
          return {
            file: filePath,
            webpFile: webpFilePath,
            originalSize,
            webpSize,
            savings,
            percentage,
            alternativeMethod: true
          };
        } else {
          throw new Error('Альтернативный метод также не смог создать WebP файл');
        }
      } catch (alternativeError) {
        throw new Error(`Не удалось конвертировать файл: ${alternativeError.message}`);
      }
    }
  } catch (error) {
    console.error(`❌ Ошибка при конвертации ${filePath}:`, error.message);
    return {
      file: filePath,
      error: error.message,
      originalSize: 0,
      webpSize: 0,
      savings: 0,
      percentage: 0
    };
  }
}

// Основная функция
async function main() {
  try {
    console.log('🔍 Поиск изображений...');
    
    // Ищем JPG, JPEG и PNG файлы
    const imageFiles = await glob('**/*.{png,jpg,jpeg}', { 
      nodir: true,
      ignore: excludeDirs.map(dir => `**/${dir}/**`),
      nocase: true // Игнорируем регистр в расширениях
    });
    
    console.log(`🖼️ Найдено ${imageFiles.length} изображений`);
    
    if (imageFiles.length === 0) {
      console.log('Изображения не найдены. Проверьте путь к проекту.');
      return;
    }
    
    console.log('🚀 Начинаю конвертацию в WebP...');
    
    // Обрабатываем изображения последовательно
    const results = [];
    for (const file of imageFiles) {
      results.push(await convertToWebp(file));
    }
    
    // Подсчитываем общую статистику
    const successful = results.filter(r => !r.error && !r.skipped);
    const skipped = results.filter(r => r.skipped);
    const failed = results.filter(r => r.error);
    const alternativeMethods = results.filter(r => r.alternativeMethod);
    
    const totalOriginal = successful.reduce((sum, r) => sum + r.originalSize, 0);
    const totalWebp = successful.reduce((sum, r) => sum + r.webpSize, 0);
    const totalSavings = totalOriginal - totalWebp;
    const totalPercentage = totalOriginal > 0 ? (totalSavings / totalOriginal * 100).toFixed(2) : 0;
    
    console.log('\n📊 Итоговая статистика:');
    console.log(`   Всего найдено: ${imageFiles.length} файлов`);
    console.log(`   Успешно конвертировано: ${successful.length} файлов`);
    console.log(`   Использован альтернативный метод: ${alternativeMethods.length} файлов`);
    console.log(`   Пропущено (исключенные директории): ${skipped.length} файлов`);
    console.log(`   Ошибок: ${failed.length} файлов`);
    console.log(`   Исходный размер: ${(totalOriginal / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   Размер WebP: ${(totalWebp / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   Общая экономия: ${(totalSavings / 1024 / 1024).toFixed(2)} MB (${totalPercentage}%)`);
    
    if (failed.length > 0) {
      console.log('\n⚠️ Файлы с ошибками:');
      failed.forEach(f => console.log(`   - ${f.file}: ${f.error}`));
    }
    
    console.log('\n💡 Примечание: WebP файлы созданы рядом с оригиналами с тем же именем, но с расширением .webp');
    console.log('   Теперь вы можете использовать их в HTML с помощью тега <picture> для поддержки разных браузеров:');
    console.log(`
    <picture>
      <source srcset="image.webp" type="image/webp">
      <img src="image.jpg" alt="Описание изображения">
    </picture>
    `);
    
  } catch (error) {
    console.error('❌ Произошла ошибка:', error);
  }
}

// Запускаем скрипт
main(); 