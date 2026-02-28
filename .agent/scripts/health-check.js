#!/usr/bin/env node
/**
 * LaPlace - Quick Health Check Script
 * Kiểm tra trạng thái các services
 * 
 * Usage: node .agent/scripts/health-check.js
 */

const http = require('http');

const services = [
  { name: 'Server API', url: 'http://localhost:7201/api/health', port: 7201 },
  { name: 'Admin Panel', url: 'http://localhost:7202', port: 7202 },
  { name: 'Client Website', url: 'http://localhost:7203', port: 7203 },
  { name: 'phpMyAdmin', url: 'http://localhost:7204', port: 7204 },
];

function checkService(service) {
  return new Promise((resolve) => {
    const req = http.get(service.url, { timeout: 3000 }, (res) => {
      resolve({ ...service, status: '✅ UP', code: res.statusCode });
    });
    req.on('error', () => {
      resolve({ ...service, status: '❌ DOWN', code: '-' });
    });
    req.on('timeout', () => {
      req.destroy();
      resolve({ ...service, status: '⏳ TIMEOUT', code: '-' });
    });
  });
}

async function main() {
  console.log('\n🏠 LaPlace - Health Check\n');
  console.log('='.repeat(55));
  console.log(`${'Service'.padEnd(20)} ${'Port'.padEnd(8)} ${'Status'.padEnd(12)} HTTP`);
  console.log('-'.repeat(55));

  const results = await Promise.all(services.map(checkService));

  results.forEach(r => {
    console.log(`${r.name.padEnd(20)} :${String(r.port).padEnd(7)} ${r.status.padEnd(12)} ${r.code}`);
  });

  console.log('='.repeat(55));
  
  const upCount = results.filter(r => r.status.includes('UP')).length;
  console.log(`\n📊 ${upCount}/${results.length} services running`);
  console.log(`📅 ${new Date().toLocaleString('vi-VN')}\n`);
}

main();
