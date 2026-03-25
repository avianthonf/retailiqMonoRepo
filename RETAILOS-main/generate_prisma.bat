@echo off
set "ROOT=%~dp0"
cd /d "%ROOT%"
echo Generating Prisma in %ROOT%
call node_modules\.bin\prisma generate --schema=prisma\schema.prisma
echo Done.
