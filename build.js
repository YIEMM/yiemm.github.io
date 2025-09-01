// 简单的构建脚本，用于复制必要的文件到生产目录
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 确保构建目录存在
const buildDir = path.join(__dirname, 'dist');
if (!fs.existsSync(buildDir)) {
  fs.mkdirSync(buildDir, { recursive: true });
}

// 复制public目录下的所有文件到dist
function copyDirectory(source, target) {
  if (!fs.existsSync(target)) {
    fs.mkdirSync(target);
  }
  
  const files = fs.readdirSync(source);
  for (const file of files) {
    const sourcePath = path.join(source, file);
    const targetPath = path.join(target, file);
    
    if (fs.lstatSync(sourcePath).isDirectory()) {
      copyDirectory(sourcePath, targetPath);
    } else {
      fs.copyFileSync(sourcePath, targetPath);
      console.log(`Copied: ${sourcePath} -> ${targetPath}`);
    }
  }
}

// 运行构建
console.log('Starting build process...');

try {
  // 复制public目录
  copyDirectory(path.join(__dirname, 'public'), buildDir);
  
  // 复制必要的配置文件
  if (fs.existsSync(path.join(__dirname, 'CNAME'))) {
    fs.copyFileSync(path.join(__dirname, 'CNAME'), path.join(buildDir, 'CNAME'));
  }
  
  if (fs.existsSync(path.join(__dirname, '.gitignore'))) {
    fs.copyFileSync(path.join(__dirname, '.gitignore'), path.join(buildDir, '.gitignore'));
  }
  
  console.log('Build completed successfully!');
  console.log(`Files are ready in ${buildDir}`);
  console.log('You can deploy the dist folder to your hosting service.');
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
}