## How to Test Your 8051 Program with External Memory

Your 8051 program expects data pre-loaded in external memory at addresses 0x8500 and 0x8501. Follow these steps:

### Step 1: Load External Memory
1. Click the **"Ext Mem"** button in the toolbar (only visible when 8051 is selected)
2. In the modal that opens:
   - **Start Address**: `8500` (default, hex format)
   - **Values**: `03,04` (comma-separated hex values)
   - Click **"Load Memory"**

This will load:
- Address 0x8500 = 0x03
- Address 0x8501 = 0x04

### Step 2: Run Your Program
1. Click the **"Run (R)"** button
2. Watch the console for the trace

### Expected Output
With the program:
```asm
MOV DPTR, #8500
MOVX A, @DPTR      ; Read 0x03 from 8500 → A = 0x03
MOV B, A           ; B = 0x03
INC DPTR           ; DPTR = 0x8501
MOVX A, @DPTR      ; Read 0x04 from 8501 → A = 0x04
MUL AB             ; 0x03 * 0x04 = 0x0C (12 decimal)
INC DPTR           ; DPTR = 0x8502
MOVX @DPTR, A      ; Write A (0x0C) to 8502
```

After execution:
- **Register A** should contain: **0x0C** (12 decimal)
- **Address 0x8502** should contain: **0x0C**

### Alternative Test Values
Try these combinations to verify different results:
- Values: `02,03` → Result: 0x06 (2 × 3)
- Values: `05,04` → Result: 0x14 (5 × 4)
- Values: `FF,02` → Result: 0xFE (255 × 2 = 510, masked to 8-bit = 0xFE)

### Verify Results
Use the **"Memory"** button (or press M) to read/write individual memory locations and confirm the values after execution.

### Notes
- The external memory loader is only available for 8051 processor
- Values are in hexadecimal by default (use `03H` or `0x03` format)
- You can load multiple bytes at once: `03,04,05,06` loads 4 bytes
