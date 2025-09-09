@echo off
cd /d "c:\Users\Hemant\Documents\project poppy"
echo Removing persistent pages directory...
if exist pages (
    echo Found pages directory, attempting removal...
    takeown /f pages /r /d y >nul 2>&1
    icacls pages /grant administrators:f /t >nul 2>&1
    rmdir /s /q pages >nul 2>&1
    if exist pages (
        echo Renaming to avoid conflicts...
        ren pages pages_disabled >nul 2>&1
    )
)
echo Done.
