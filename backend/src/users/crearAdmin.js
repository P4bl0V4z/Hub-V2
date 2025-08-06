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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = require("@prisma/client");
var bcrypt_1 = require("bcrypt");
var prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var email, password, nombre, nombreEmpresaMaestra, empresa, rolAdmin, usuario, hashedPassword, usuarioEmpresa;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    email = 'admin@beloop.io';
                    password = 'Bel00per.2025';
                    nombre = 'admin';
                    nombreEmpresaMaestra = 'BeLoop';
                    return [4 /*yield*/, prisma.empresa.findFirst({
                            where: {
                                nombre: nombreEmpresaMaestra,
                                esEmpresaMaestra: true,
                            },
                        })];
                case 1:
                    empresa = _a.sent();
                    if (!!empresa) return [3 /*break*/, 3];
                    return [4 /*yield*/, prisma.empresa.create({
                            data: {
                                nombre: nombreEmpresaMaestra,
                                esEmpresaMaestra: true,
                            },
                        })];
                case 2:
                    empresa = _a.sent();
                    console.log('Empresa maestra creada:', empresa.nombre);
                    _a.label = 3;
                case 3: return [4 /*yield*/, prisma.rol.findUnique({
                        where: { nombre: 'admin' },
                    })];
                case 4:
                    rolAdmin = _a.sent();
                    if (!!rolAdmin) return [3 /*break*/, 6];
                    return [4 /*yield*/, prisma.rol.create({
                            data: {
                                nombre: 'admin',
                                descripcion: 'Usuario administrador del sistema',
                                soloEmpresaMaestra: true,
                            },
                        })];
                case 5:
                    rolAdmin = _a.sent();
                    console.log('Rol admin creado.');
                    _a.label = 6;
                case 6: return [4 /*yield*/, prisma.usuario.findUnique({
                        where: { email: email },
                    })];
                case 7:
                    usuario = _a.sent();
                    if (usuario) {
                        console.log('El usuario admin ya existe.');
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, bcrypt_1.default.hash(password, 10)];
                case 8:
                    hashedPassword = _a.sent();
                    return [4 /*yield*/, prisma.usuario.create({
                            data: {
                                email: email,
                                password: hashedPassword,
                                nombre: nombre,
                                activo: true,
                            },
                        })];
                case 9:
                    usuario = _a.sent();
                    return [4 /*yield*/, prisma.usuarioEmpresa.create({
                            data: {
                                usuario: { connect: { id: usuario.id } },
                                empresa: { connect: { id: empresa.id } },
                            },
                        })];
                case 10:
                    usuarioEmpresa = _a.sent();
                    return [4 /*yield*/, prisma.usuarioRol.create({
                            data: {
                                usuarioEmpresa: { connect: { id: usuarioEmpresa.id } },
                                rol: { connect: { id: rolAdmin.id } },
                            },
                        })];
                case 11:
                    _a.sent();
                    console.log('Usuario admin creado correctamente.');
                    return [2 /*return*/];
            }
        });
    });
}
main()
    .catch(function (e) {
    console.error(e);
    process.exit(1);
})
    .finally(function () {
    prisma.$disconnect();
});
