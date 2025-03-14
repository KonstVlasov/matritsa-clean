const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const glob = promisify(require('glob'));

/**
 * Скрипт для замены ссылок на изображения в файлах сайта
 * Заменяет .png на .webp и .jpg/.jpeg на .webp
 */

// Путь к директории с файлами сайта
const SITE_DIR = 'u2865078/data/www/matritsa-taro.ru';

// Типы файлов, в которых нужно искать ссылки на изображения
const FILE_EXTENSIONS = ['html', 'htm', 'js', 'css', 'php'];

// Регулярные выражения для поиска ссылок на изображения
const IMAGE_PATTERNS = [
  // Для путей в кавычках (например, в src атрибутах и т.д.)
  {
    regex: /(['"])([^'"]*\.(?:png|jpg|jpeg))(['"])/gi,
    replacer: (match, quote1, path, quote2) => {
      // Проверяем, не является ли это уже webp
      if (path.toLowerCase().endsWith('.webp')) {
        return match;
      }
      
      // Заменяем расширение на .webp
      const newPath = path.replace(/\.(png|jpg|jpeg)$/i, '.webp');
      return `${quote1}${newPath}${quote2}`;
    }
  },
  
  // Для url() в CSS
  {
    regex: /url\((['"]?)([^'"()]*\.(?:png|jpg|jpeg))(['"]?)\)/gi,
    replacer: (match, quote1, path, quote2) => {
      // Проверяем, не является ли это уже webp
      if (path.toLowerCase().endsWith('.webp')) {
        return match;
      }
      
      // Заменяем расширение на .webp
      const newPath = path.replace(/\.(png|jpg|jpeg)$/i, '.webp');
      return `url(${quote1}${newPath}${quote2})`;
    }
  },
  
  // Для HTML тегов img
  {
    regex: /(<img[^>]*src=["'])([^"']*\.(?:png|jpg|jpeg))(["'][^>]*>)/gi,
    replacer: (match, prefix, path, suffix) => {
      // Проверяем, не является ли это уже webp
      if (path.toLowerCase().endsWith('.webp')) {
        return match;
      }
      
      // Заменяем расширение на .webp
      const newPath = path.replace(/\.(png|jpg|jpeg)$/i, '.webp');
      return `${prefix}${newPath}${suffix}`;
    }
  },
  
  // Для HTML тегов picture с source
  {
    regex: /(<source[^>]*srcset=["'])([^"']*\.(?:png|jpg|jpeg))(["'][^>]*>)/gi,
    replacer: (match, prefix, path, suffix) => {
      // Проверяем, не является ли это уже webp
      if (path.toLowerCase().endsWith('.webp')) {
        return match;
      }
      
      // Заменяем расширение на .webp
      const newPath = path.replace(/\.(png|jpg|jpeg)$/i, '.webp');
      return `${prefix}${newPath}${suffix}`;
    }
  }
];

// Функция для проверки существования файла WebP
function webpFileExists(imagePath) {
  // Получаем абсолютный путь к файлу
  const fullPath = path.resolve(process.cwd(), imagePath);
  
  // Получаем директорию и имя файла
  const dir = path.dirname(fullPath);
  const fileNameWithoutExt = path.basename(fullPath, path.extname(fullPath));
  
  // Путь к WebP версии
  const webpPath = path.join(dir, `${fileNameWithoutExt}.webp`);
  
  return fs.existsSync(webpPath);
}

// Функция для замены ссылок на изображения в файле
async function replaceImageReferences(filePath) {
  try {
    console.log(`Обрабатываю: ${filePath}`);
    
    // Читаем содержимое файла
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;
    let replacements = 0;
    
    // Применяем все регулярные выражения
    for (const pattern of IMAGE_PATTERNS) {
      content = content.replace(pattern.regex, (match, ...args) => {
        const result = pattern.replacer(match, ...args);
        
        // Если произошла замена, увеличиваем счетчик
        if (result !== match) {
          replacements++;
        }
        
        return result;
      });
    }
    
    // Если были замены, записываем изменения в файл
    if (replacements > 0) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Заменено ссылок: ${replacements} в файле ${filePath}`);
      return {
        file: filePath,
        replacements
      };
    } else {
      console.log(`ℹ️ Нет замен в файле ${filePath}`);
      return {
        file: filePath,
        replacements: 0
      };
    }
  } catch (error) {
    console.error(`❌ Ошибка при обработке ${filePath}:`, error.message);
    return {
      file: filePath,
      error: error.message
    };
  }
}

// Основная функция
async function main() {
  try {
    console.log(`🔍 Поиск файлов в директории: ${SITE_DIR}`);
    
    // Находим все файлы с нужными расширениями
    const files = [];
    
    // Обрабатываем каждое расширение отдельно
    for (const ext of FILE_EXTENSIONS) {
      const pattern = `${SITE_DIR}/**/*.${ext}`;
      const foundFiles = await glob(pattern, { nodir: true });
      files.push(...foundFiles);
    }
    
    console.log(`📄 Найдено ${files.length} файлов для обработки`);
    
    if (files.length === 0) {
      console.log('Файлы не найдены. Проверьте путь к проекту.');
      return;
    }
    
    console.log('🚀 Начинаю замену ссылок на изображения...');
    
    // Создаем резервную копию директории перед изменениями
    const backupDir = `./${path.basename(SITE_DIR)}_backup_${Date.now()}`;
    console.log(`📦 Создаю резервную копию в ${backupDir}`);
    
    // Рекурсивно копируем директорию
    const copyDir = (src, dest) => {
      // Создаем директорию назначения, если она не существует
      if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
      }
      
      // Получаем содержимое директории
      const entries = fs.readdirSync(src, { withFileTypes: true });
      
      // Копируем каждый файл/директорию
      for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);
        
        if (entry.isDirectory()) {
          // Рекурсивно копируем поддиректории
          copyDir(srcPath, destPath);
        } else {
          // Копируем файлы
          fs.copyFileSync(srcPath, destPath);
        }
      }
    };
    
    copyDir(SITE_DIR, backupDir);
    console.log(`✅ Резервная копия создана в ${backupDir}`);
    
    // Обрабатываем файлы последовательно
    const results = [];
    for (const file of files) {
      results.push(await replaceImageReferences(file));
    }
    
    // Подсчитываем общую статистику
    const successful = results.filter(r => !r.error);
    const failed = results.filter(r => r.error);
    const totalReplacements = successful.reduce((sum, r) => sum + r.replacements, 0);
    const filesWithReplacements = successful.filter(r => r.replacements > 0).length;
    
    console.log('\n📊 Итоговая статистика:');
    console.log(`   Всего обработано: ${files.length} файлов`);
    console.log(`   Файлов с заменами: ${filesWithReplacements}`);
    console.log(`   Всего замен: ${totalReplacements}`);
    console.log(`   Ошибок: ${failed.length}`);
    
    if (failed.length > 0) {
      console.log('\n⚠️ Файлы с ошибками:');
      failed.forEach(f => console.log(`   - ${f.file}: ${f.error}`));
    }
    
    console.log('\n💡 Примечание: Резервная копия исходных файлов сохранена в директории:');
    console.log(`   ${backupDir}`);
    console.log('   Если что-то пошло не так, вы можете восстановить файлы из этой копии.');
    
    console.log('\n🔍 Проверьте работу сайта после замены расширений!');
    console.log('   Убедитесь, что все изображения загружаются корректно.');
    
  } catch (error) {
    console.error('❌ Произошла ошибка:', error);
  }
}

// Запускаем скрипт
main(); 