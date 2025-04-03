```
git clone https://github.com/thediymaker/slurm-node-dashboard.git
cd slurm-node-dashboard
npm install next@14.2.8
npm install
npm audit fix
cat .env

logo djhpc.svg 放在 public/下的

pm2 start npm --name "hpc-dashboard" -- run dev
pm2 save
pm2 startup
```

