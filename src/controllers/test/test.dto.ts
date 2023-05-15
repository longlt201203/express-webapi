import { IsNumber } from "class-validator";

export default class TestDto {
    @IsNumber()
    testNumber: number;
}