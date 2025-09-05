import { Controller, Get, Post, Body, Param, Delete, Put, ParseIntPipe } from "@nestjs/common";
import { FlightService } from "./flight.service";
import { CreateFlightDto } from "./dto/create-flight.dto";
import { UpdateFlightDto } from "./dto/update-flight.dto";

@Controller("flights")
export class FlightController {
  constructor(private readonly flightService: FlightService) {}

  @Post()
  create(@Body() createFlightDto: CreateFlightDto) {
    return this.flightService.create(createFlightDto);
  }

  @Get()
  findAll() {
    return this.flightService.findAll();
  }

  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.flightService.findOne(id);
  }

  @Put(":id")
  update(@Param("id", ParseIntPipe) id: number, @Body() updateFlightDto: UpdateFlightDto) {
    return this.flightService.update(id, updateFlightDto);
  }

  @Delete(":id")
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.flightService.remove(id);
  }
}
