import { IsInt, IsNotEmpty, IsString, Length, Max, Min } from 'class-validator';

export class CreateBookDTO {
  @IsNotEmpty()
  @IsString()
  @Length(3, 100)
  title: string;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(1000)
  price: number;

  @IsNotEmpty()
  @IsString()
  authorId: string;
}
