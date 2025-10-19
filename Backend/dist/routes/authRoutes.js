"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const CustomerAuth_js_1 = require("../controllers/CustomerAuth.js");
const DealerAuth_js_1 = require("../controllers/DealerAuth.js");
const ServiceAuth_js_1 = require("../controllers/ServiceAuth.js");
router.post('/customer/signup', CustomerAuth_js_1.Csignup);
router.post('/customer/login', CustomerAuth_js_1.Clogin);
router.post('/dealer/signup', DealerAuth_js_1.Dsignup);
router.post('/dealer/login', DealerAuth_js_1.Dlogin);
router.post('/service/signup', ServiceAuth_js_1.Ssignup);
router.post('/service/login', ServiceAuth_js_1.Slogin);
exports.default = router;
