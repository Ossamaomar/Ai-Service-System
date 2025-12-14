import { Router } from "express";

import authRoutes from "./auth.routes";
import customerRoutes from "./customer.routes";
import ticketRoutes from "./ticket.routes";
import partRoutes from "./part.routes";
import ticketPartRoutes from "./ticketPart.routes";
import repairRoutes from "./repair.routes";
import ticketRepairRoutes from "./ticketRepair.routes";
import deviceRoutes from "./device.routes";
import userRoutes from "./user.routes";

const router = Router();

// App routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/customers', customerRoutes);
router.use('/tickets', ticketRoutes);
router.use('/devices', deviceRoutes);
router.use('/parts', partRoutes);
router.use('/ticketParts', ticketPartRoutes);
router.use('/repairs', repairRoutes);
router.use('/ticketRepairs', ticketRepairRoutes);


export default router;