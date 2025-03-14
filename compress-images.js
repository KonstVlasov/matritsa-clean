const fs = require('fs');
const path = require('path');
const imagemin = require('imagemin');
const imageminPngquant = require('imagemin-pngquant');
const imageminOptipng = require('imagemin-optipng');
const imageminMozjpeg = require('imagemin-mozjpeg');
const { promisify } = require('util');
const glob = promisify(require('glob'));

/**
 * Скрипт для сжатия всех PNG-изображений в проекте
 * Использует imagemin с плагинами pngquant и optipng для максимального сжатия
 */

// Директории, которые нужно исключить из поиска
const excludeDirs = ['node_modules', 'dist', 'build', 'temp'];

// Функция для сжатия изображения
async function compressImage(filePath) {
  try {
    const dir = path.dirname(filePath);
    const fileName = path.basename(filePath);
    const ext = path.extname(filePath).toLowerCase();
    
    console.log(`Сжимаю: ${filePath}`);
    
    // Получаем размер до сжатия
    const originalSize = fs.statSync(filePath).size;
    
    // Создаем временную директорию для сжатого файла
    const tempDir = path.join(dir, '.temp_compressed');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    
    // Выбираем плагины в зависимости от типа файла
    const plugins = [];
    
    if (ext === '.png') {
      // Для PNG используем более агрессивные настройки
      plugins.push(
        imageminPngquant({
          quality: [0.3, 0.5], // Более агрессивное сжатие
          speed: 1,
          strip: true
        }),
        imageminOptipng({
          optimizationLevel: 7 // Максимальный уровень
        })
      );
    } else if (ext === '.jpg' || ext === '.jpeg') {
      // Для JPEG
      plugins.push(
        imageminMozjpeg({
          quality: 70,
          progressive: true
        })
      );
    }
    
    // Если нет подходящих плагинов, пропускаем файл
    if (plugins.length === 0) {
      console.log(`⚠️ Пропускаю: ${filePath} (неподдерживаемый формат)`);
      return {
        file: filePath,
        originalSize,
        compressedSize: originalSize,
        savings: 0,
        percentage: 0
      };
    }
    
    // Сжимаем изображение во временную директорию
    await imagemin([filePath], {
      destination: tempDir,
      plugins
    });
    
    const tempFilePath = path.join(tempDir, fileName);
    
    // Проверяем размер сжатого файла
    const compressedSize = fs.statSync(tempFilePath).size;
    const savings = originalSize - compressedSize;
    const percentage = (savings / originalSize * 100).toFixed(2);
    
    // Если сжатие дало результат, заменяем оригинальный файл
    if (compressedSize < originalSize) {
      // Создаем резервную копию оригинала
      const backupDir = path.join(dir, '.backup');
      if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
      }
      fs.copyFileSync(filePath, path.join(backupDir, fileName));
      
      // Заменяем оригинал сжатым файлом
      fs.copyFileSync(tempFilePath, filePath);
      
      console.log(`✅ Готово: ${filePath}`);
      console.log(`   Исходный размер: ${(originalSize / 1024).toFixed(2)} KB`);
      console.log(`   Новый размер: ${(compressedSize / 1024).toFixed(2)} KB`);
      console.log(`   Экономия: ${(savings / 1024).toFixed(2)} KB (${percentage}%)`);
    } else {
      console.log(`ℹ️ Пропущено: ${filePath} (сжатие не дало улучшений)`);
    }
    
    // Удаляем временные файлы
    fs.rmSync(tempDir, { recursive: true, force: true });
    
    return {
      file: filePath,
      originalSize,
      compressedSize: compressedSize < originalSize ? compressedSize : originalSize,
      savings: compressedSize < originalSize ? savings : 0,
      percentage: compressedSize < originalSize ? percentage : 0
    };
  } catch (error) {
    console.error(`❌ Ошибка при сжатии ${filePath}:`, error);
    return {
      file: filePath,
      error: error.message,
      originalSize: 0,
      compressedSize: 0,
      savings: 0,
      percentage: 0
    };
  }
}

// Основная функция
async function main() {
  try {
    console.log('🔍 Поиск изображений...');
    
    // Ищем PNG и JPEG файлы
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
    
    console.log('🚀 Начинаю сжатие...');
    
    // Обрабатываем изображения последовательно, чтобы не перегружать систему
    const results = [];
    for (const file of imageFiles) {
      results.push(await compressImage(file));
    }
    
    // Подсчитываем общую статистику
    const successful = results.filter(r => !r.error && r.savings > 0);
    const skipped = results.filter(r => !r.error && r.savings === 0);
    const failed = results.filter(r => r.error);
    
    const totalOriginal = successful.reduce((sum, r) => sum + r.originalSize, 0);
    const totalCompressed = successful.reduce((sum, r) => sum + r.compressedSize, 0);
    const totalSavings = totalOriginal - totalCompressed;
    const totalPercentage = totalOriginal > 0 ? (totalSavings / totalOriginal * 100).toFixed(2) : 0;
    
    console.log('\n📊 Итоговая статистика:');
    console.log(`   Всего обработано: ${imageFiles.length} файлов`);
    console.log(`   Успешно сжато: ${successful.length} файлов`);
    console.log(`   Пропущено (уже оптимизированы): ${skipped.length} файлов`);
    console.log(`   Ошибок: ${failed.length} файлов`);
    console.log(`   Исходный размер: ${(totalOriginal / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   Новый размер: ${(totalCompressed / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   Общая экономия: ${(totalSavings / 1024 / 1024).toFixed(2)} MB (${totalPercentage}%)`);
    
    if (failed.length > 0) {
      console.log('\n⚠️ Файлы с ошибками:');
      failed.forEach(f => console.log(`   - ${f.file}: ${f.error}`));
    }
    
    console.log('\n💡 Примечание: Резервные копии оригинальных файлов сохранены в папках .backup');
    
  } catch (error) {
    console.error('❌ Произошла ошибка:', error);
  }
}

// Запускаем скрипт
main(); 