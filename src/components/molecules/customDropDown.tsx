import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function CustomDropDown({
    label,
    placeholder,
    handleChange,
    options,
    defaultValue,
    customOptions
}:{
    label: string,
    placeholder: string,
    handleChange: (e:any)=> void,
    options: any[],
    defaultValue: string,
    customOptions?: any[]
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label>{label}</Label>
      <Select onValueChange={handleChange} defaultValue={defaultValue}>
        <SelectTrigger className="w-[42vw]  md:w-[200px]">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {
            customOptions?.map((option) => (
                <SelectItem value={option.value}>{option.label}</SelectItem>
            ))
          }
          {options.map((source) => (
            <SelectItem key={source.value || source.id} value={source.value || source.id}>
              {source.label || source.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
