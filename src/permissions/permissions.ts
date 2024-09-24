import { AbilityBuilder } from "@casl/ability";
import { AppAbility } from ".";
import { User } from "./models/user";
import { Role } from "./roles";


type PermissionsByRole = (user: User, builder: AbilityBuilder<AppAbility>) => void;

export const permissions: Record<Role, PermissionsByRole> = {
  ADMIN(user, { can, cannot }) {
    can('manage', 'all')
  },
  DELIVERYMAN(user, { can }) {
    can('get', 'User')
    can(['update', 'delete'], 'User', {
      id: {
        $eq: user.id
      }
    })
  }
}