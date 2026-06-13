@echo off
REM ============================================================
REM  copy-audio.bat — copies the 40 mp3s from your extract folder
REM  into engineer\audio\ so the deploy bundle is complete.
REM
REM  Run this AFTER you've unzipped engineer-game-deliverables.zip
REM  into the same folder that contains "extracted\audio\".
REM
REM  Example layout BEFORE running:
REM    C:\Users\uzair\Downloads\Engineer Mission\
REM      ├── extracted\
REM      │   └── audio\audio_000.mp3 .. audio_039.mp3
REM      └── engineer\          (the unzipped deliverable)
REM          ├── index.html
REM          ├── js\
REM          └── css\
REM
REM  Layout AFTER:
REM      └── engineer\
REM          └── audio\         (now populated)
REM ============================================================

setlocal

set "SRC=..\extracted\audio"
set "DST=audio"

if not exist "%SRC%" (
  echo [ERROR] Source folder not found: %SRC%
  echo Run this script from inside the engineer\ folder, with
  echo extracted\audio\ as a sibling folder one level up.
  exit /b 1
)

if not exist "%DST%" mkdir "%DST%"

echo Copying mp3s from %SRC% to %DST% ...
copy /Y "%SRC%\*.mp3" "%DST%\" >nul
if errorlevel 1 (
  echo [ERROR] Copy failed.
  exit /b 1
)

set COUNT=0
for %%F in ("%DST%\*.mp3") do set /a COUNT+=1
echo Done. %COUNT% mp3 files now in %DST%\
echo.
echo Expected: 40 files (audio_000.mp3 through audio_039.mp3)
endlocal
