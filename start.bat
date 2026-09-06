@echo off
echo.
echo  ╔═══════════════════════════════════════╗
echo  ║   FakeGuard — Fake News Detection     ║
echo  ║   Starting API server...              ║
echo  ╚═══════════════════════════════════════╝
echo.
echo  Models: BERT (bert_final) + LR + XGBoost
echo  Frontend: http://localhost:8000
echo  API Docs: http://localhost:8000/docs
echo.
fakeguard-env\Scripts\uvicorn.exe app:app --host 0.0.0.0 --port 8000 --reload
