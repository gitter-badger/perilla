import { Response, Router } from "express";
import { ServerError } from "../../definitions/errors";
import { IAuthorizedRequest } from "../../definitions/requests";
import { Role } from "../../schemas/role";

export let RoleRouter = Router();

RoleRouter.post("/new", async (req: IAuthorizedRequest, res: Response) => {
    try {
        if (!req.commonAccess.createRole) { throw new ServerError("No access", 403); }
        const role = new Role();
        role.rolename = req.body.rolename;
        role.description = req.body.description;
        role.config = req.body.config;
        await role.save();
        res.send(role._id);
    } catch (e) {
        if (e instanceof ServerError) {
            res.status(e.code).send(e.message);
        } else {
            res.status(500).send(e.message);
        }
    }
});

RoleRouter.get("/list", async (req: IAuthorizedRequest, res: Response) => {
    try {
        const roles = await Role.find();
        res.send(roles);
    } catch (e) {
        if (e instanceof ServerError) {
            res.status(e.code).send(e.message);
        } else {
            res.status(500).send(e.message);
        }
    }
});

RoleRouter.get("/:id", async (req: IAuthorizedRequest, res: Response) => {
    try {
        const role = await Role.findOne({ _id: req.params.id });
        if (!role) { throw new ServerError("Not found", 404); }
        res.send(role);
    } catch (e) {
        if (e instanceof ServerError) {
            res.status(e.code).send(e.message);
        } else {
            res.status(500).send(e.message);
        }
    }
});

RoleRouter.post("/:id", async (req: IAuthorizedRequest, res: Response) => {
    try {
        if (!req.commonAccess.modifyRole) { throw new ServerError("No access", 403); }
        const role = await Role.findOne({ _id: req.params.id });
        if (!role) { throw new ServerError("Not found", 404); }
        if (role._protected) { throw new ServerError("Object is protected", 403); }
        role.rolename = req.body.rolename;
        role.description = req.body.description;
        role.config = req.body.config;
        await role.save();
        res.send("success");
    } catch (e) {
        if (e instanceof ServerError) {
            res.status(e.code).send(e.message);
        } else {
            res.status(500).send(e.message);
        }
    }
});

RoleRouter.delete("/:id", async (req: IAuthorizedRequest, res: Response) => {
    try {
        if (!req.commonAccess.modifyRole) { throw new ServerError("No access", 403); }
        const role = await Role.findOne({ _id: req.params.id });
        if (!role) { throw new ServerError("Not found", 404); }
        if (role._protected) { throw new ServerError("Object is protected", 403); }
        await role.remove();
        res.send("success");
    } catch (e) {
        if (e instanceof ServerError) {
            res.status(e.code).send(e.message);
        } else {
            res.status(500).send(e.message);
        }
    }
});