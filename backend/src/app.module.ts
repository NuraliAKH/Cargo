import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { PrismaService } from "./prisma.service";
import { WarehousesModule } from "./warehouses/warehouses.module";
import { ParcelsModule } from "./parcels/parcels.module";
import { AddressesModule } from "./addresses/addresses.module";
import { FlightModule } from "./flight/flight.module";
import { RecipientModule } from "./recipient/recipient.module";

@Module({
  imports: [AuthModule, UsersModule, WarehousesModule, ParcelsModule, AddressesModule, FlightModule, RecipientModule],
  providers: [PrismaService],
})
export class AppModule {}
