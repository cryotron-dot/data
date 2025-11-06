const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');
const { exec } = require('child_process');
const util = require('util');

const execPromise = util.promisify(exec);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Helper function to read JSON file
async function readJsonFile(filename) {
  try {
    const filePath = path.join(__dirname, filename);
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    throw new Error(`Failed to read ${filename}: ${error.message}`);
  }
}

// Helper function to write JSON file
async function writeJsonFile(filename, data) {
  try {
    const filePath = path.join(__dirname, filename);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    throw new Error(`Failed to write ${filename}: ${error.message}`);
  }
}

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Get all data from riot-output.json
app.get('/api/data', async (req, res) => {
  try {
    const data = await readJsonFile('riot-output.json');
    res.json({
      success: true,
      data: data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get all data from riot-output-2.json
app.get('/api/data2', async (req, res) => {
  try {
    const data = await readJsonFile('riot-output-2.json');
    res.json({
      success: true,
      data: data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Update riot-output.json
app.post('/api/data', async (req, res) => {
  try {
    await writeJsonFile('riot-output.json', req.body);
    res.json({
      success: true,
      message: 'Data updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Update riot-output-2.json
app.post('/api/data2', async (req, res) => {
  try {
    await writeJsonFile('riot-output-2.json', req.body);
    res.json({
      success: true,
      message: 'Data updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Execute command endpoint (with security warnings)
app.post('/api/command', async (req, res) => {
  const { command, timeout = 30000 } = req.body;

  if (!command) {
    return res.status(400).json({
      success: false,
      error: 'Command is required'
    });
  }

  // WARNING: Executing arbitrary commands is a security risk
  // Only use this in a controlled environment
  console.warn(`Executing command: ${command}`);

  try {
    const { stdout, stderr } = await execPromise(command, {
      timeout: timeout,
      maxBuffer: 1024 * 1024 * 10 // 10MB buffer
    });

    res.json({
      success: true,
      stdout: stdout,
      stderr: stderr,
      command: command
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      stdout: error.stdout || '',
      stderr: error.stderr || '',
      command: command
    });
  }
});

// Get list of available files
app.get('/api/files', async (req, res) => {
  try {
    const files = await fs.readdir(__dirname);
    const jsonFiles = files.filter(file => file.endsWith('.json'));
    res.json({
      success: true,
      files: jsonFiles
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    error: err.message || 'Internal server error'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📊 API endpoints:`);
  console.log(`   GET  /api/health       - Health check`);
  console.log(`   GET  /api/data         - Get riot-output.json`);
  console.log(`   GET  /api/data2        - Get riot-output-2.json`);
  console.log(`   POST /api/data         - Update riot-output.json`);
  console.log(`   POST /api/data2        - Update riot-output-2.json`);
  console.log(`   POST /api/command      - Execute command (USE WITH CAUTION)`);
  console.log(`   GET  /api/files        - List available JSON files`);
});

module.exports = app;
