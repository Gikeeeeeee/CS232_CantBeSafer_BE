// ตอนสร้าง Token สร้างตามนี้ก็ได้นะ
// const Token = jwt.sign(
//         { 
//           user_id: user.user_id, 
//           username: user.username, 
//           role: user.role  <<<อันนี้ต้องมี
//         }, 
//         process.env.TOKEN_KEY as string, 
//         { expiresIn: "2h" }
//     );

import jwt, { JwtPayload } from 'jsonwebtoken';

// หา TOKEN_KEY ใน .env
const config = process.env;

export const verifytoken = (req: any, res: any, next: any) => {

    // ดึง Token จาก Cookies
    let token = req.cookies?.accessToken;

    // ถ้าไม่มีใน cookie ดึงจาก header
    if (!token) {
        const authHeader = req.headers['authorization'];
        if (authHeader) {
            token = authHeader;
        }
    }
     // ถ้าไม่มี token แนบมา return 403
    if (!token) {
        return res.status(403).send("A token is require");
    }

    // verify token ถ้า token ผิด return 401
    try{
        const decoded = jwt.verify(token as string, config.TOKEN_KEY as string);
        req.user = decoded;
    }catch(err){
        console.log("JWT Verify Error:", err);
        return res.status(401).send("Invalid or Expired token");
    }

    return next();
};

// Check role ตามที่รับมา
export const checkRole = (roles: string[]) => {
  return (req: any, res: any, next: any) => {

    // มีข้อมูล user ใน token มั้ย
    if (!req.user) {
      return res.status(401).send("Unauthorized");
    }

    // ดึง role ออกมาจาก token
    const userRole = req.user.role; 

    // ถ้า role ถูกให้ผ่าน ถ้าผิด return 403
    if (roles.includes(userRole)) {
      return next();
    } else {
      return res.status(403).send("You do not have permission");
    }
  };
};