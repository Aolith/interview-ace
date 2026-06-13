"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const auth_1 = __importDefault(require("../middlewares/auth"));
const userRoutes = express_1.default.Router();
//用户注册
userRoutes.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { password, email } = req.body;
        // 非空检查
        if (!password || !email) {
            return res.status(400).json({ message: '邮箱和密码不能为空' });
        }
        //唯一性检查
        const existingUser = yield User_1.default.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: '邮箱已被使用' });
        }
        //邮箱格式检查
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({ error: '邮箱格式不正确' });
        }
        //密码格式检查
        if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,16}$/.test(password)) {
            return res.status(400).json({ error: '密码必须包含字母和数字,长度8-16位' });
        }
        //密码加密
        const salt = yield bcryptjs_1.default.genSalt(10);
        const hashedPassword = yield bcryptjs_1.default.hash(password, salt);
        //构造新的用户
        const newUser = yield User_1.default.create({
            email: req.body.email,
            password: hashedPassword
        });
        console.log('新用户添加成功:', email);
        const _a = newUser.toObject(), { password: _ } = _a, safeUser = __rest(_a, ["password"]);
        res.status(201).json({ user: safeUser });
    }
    catch (error) {
        console.log('注册失败', error);
        res.status(500).json({ message: '服务器内部错误' });
    }
}));
//用户登录
userRoutes.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        //非空检查
        if (!email || !password) {
            return res.status(400).json({ message: '邮箱和密码不能为空' });
        }
        //查找用户
        const user = yield User_1.default.findOne({ email }).select('+password');
        if (!user) {
            return res.status(400).json({ message: '用户不存在' });
        }
        //密码验证
        const isMatch = yield bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: '密码错误' });
        }
        // 生成 JWT token
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        //登录成功
        console.log('用户登录成功:', email);
        const _a = user.toObject(), { password: _ } = _a, safeUser = __rest(_a, ["password"]);
        res.json({ user: safeUser, token });
    }
    catch (error) {
        console.log('登录失败', error);
        res.status(500).json({ message: '服务器内部错误' });
    }
}));
//获取当前用户信息
userRoutes.get('/me', auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.default.findById(req.user._id).select('-password');
        if (!user) {
            return res.status(404).json({ message: '用户不存在' });
        }
        res.json({ user });
    }
    catch (error) {
        console.log('获取当前用户信息失败', error);
        res.status(500).json({ message: '服务器内部错误' });
    }
}));
//更新用户信息
userRoutes.put('/me', auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedUser = yield User_1.default.findByIdAndUpdate(req.user._id, req.body, { new: true }).select('-password');
        if (!updatedUser) {
            return res.status(404).json({ message: '用户不存在' });
        }
        res.json({ user: updatedUser });
    }
    catch (error) {
        console.log('更新用户信息失败', error);
        res.status(500).json({ message: '服务器内部错误' });
    }
}));
exports.default = userRoutes;
