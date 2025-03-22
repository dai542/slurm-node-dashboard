"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ChevronsUpDown, X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";

export type LogicType = "AND" | "OR";

export interface FeatureSelectorProps {
  features: string[];
  selectedFeatures: string[];
  onFeaturesChange: (features: string[], logicType: LogicType) => void;
  logicType?: LogicType;
  className?: string;
}

const FeatureSelector: React.FC<FeatureSelectorProps> = ({
  features = [],
  selectedFeatures = [],
  onFeaturesChange,
  logicType = "OR",
  className,
}) => {
  const [open, setOpen] = useState(false);
  const [selectedFeatureValues, setSelectedFeatureValues] =
    useState<string[]>(selectedFeatures);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLogicType, setSelectedLogicType] =
    useState<LogicType>(logicType);

  useEffect(() => {
    setSelectedFeatureValues(selectedFeatures);
  }, [selectedFeatures]);

  // Only notify parent when values actually change and not on every render
  const notifyParentRef = useRef(false);

  useEffect(() => {
    // Skip the initial render
    if (notifyParentRef.current) {
      onFeaturesChange(selectedFeatureValues, selectedLogicType);
    } else {
      notifyParentRef.current = true;
    }
  }, [selectedFeatureValues, selectedLogicType]);

  const toggleFeature = (feature: string) => {
    setSelectedFeatureValues((current) => {
      if (current.includes(feature)) {
        return current.filter((item) => item !== feature);
      } else {
        return [...current, feature];
      }
    });
  };

  const clearFeatures = () => {
    setSelectedFeatureValues([]);
  };

  const getFeatureDisplayValue = () => {
    if (!selectedFeatureValues || selectedFeatureValues.length === 0) {
      return "All Features";
    }

    if (selectedFeatureValues.length === 1) {
      return selectedFeatureValues[0].toUpperCase();
    }

    return `${selectedFeatureValues.length} features ${
      selectedLogicType === "AND" ? "(AND)" : "(OR)"
    }`;
  };

  // Filter features based on search query
  const filteredFeatures =
    features?.filter((feature) =>
      feature?.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  return (
    <div className={cn("feature-selector", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[200px] justify-between whitespace-nowrap overflow-hidden"
          >
            <span className="truncate">{getFeatureDisplayValue()}</span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[320px] p-0" align="end">
          <div className="p-2">
            <div className="flex items-center justify-between mb-2">
              <Input
                placeholder="Search features..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 mr-2"
              />
              <ToggleGroup
                type="single"
                value={selectedLogicType}
                onValueChange={(value) =>
                  value && setSelectedLogicType(value as LogicType)
                }
              >
                <ToggleGroupItem value="AND" className="px-3 py-1 text-xs">
                  AND
                </ToggleGroupItem>
                <ToggleGroupItem value="OR" className="px-3 py-1 text-xs">
                  OR
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
            <ScrollArea className="h-[240px]">
              <div className="p-2">
                {/* Selected Features at the top */}
                {selectedFeatureValues.length > 0 && (
                  <>
                    <div className="mb-2">
                      <div className="text-xs font-medium text-muted-foreground mb-1">
                        Selected
                      </div>
                      {selectedFeatureValues.map((feature) => (
                        <div
                          key={`selected-${feature}`}
                          className="flex items-center space-x-2 py-1 pl-1 bg-muted/50 rounded-md mb-1"
                        >
                          <Checkbox
                            id={`selected-feature-${feature}`}
                            checked={true}
                            onCheckedChange={() => toggleFeature(feature)}
                          />
                          <label
                            htmlFor={`selected-feature-${feature}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer uppercase flex-grow"
                          >
                            {feature}
                          </label>
                          <button
                            type="button"
                            onClick={() => toggleFeature(feature)}
                            className="h-5 w-5 rounded-sm hover:bg-muted flex items-center justify-center"
                            aria-label={`Remove ${feature}`}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearFeatures}
                        className="w-full mt-2 h-7 text-xs flex items-center justify-center"
                      >
                        Clear all ({selectedFeatureValues.length})
                      </Button>
                      <div className="border-t my-2"></div>
                    </div>
                  </>
                )}

                {/* Available Features */}
                {filteredFeatures.length > 0 ? (
                  <>
                    {selectedFeatureValues.length > 0 && (
                      <div className="text-xs font-medium text-muted-foreground mb-1">
                        Available
                      </div>
                    )}
                    {filteredFeatures
                      .filter(
                        (feature) => !selectedFeatureValues.includes(feature)
                      )
                      .map((feature) => (
                        <div
                          key={feature}
                          className="flex items-center space-x-2 py-1"
                        >
                          <Checkbox
                            id={`feature-${feature}`}
                            checked={false}
                            onCheckedChange={() => toggleFeature(feature)}
                          />
                          <label
                            htmlFor={`feature-${feature}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer uppercase"
                          >
                            {feature}
                          </label>
                        </div>
                      ))}
                  </>
                ) : (
                  <div className="py-6 text-center text-sm">
                    No features found
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default FeatureSelector;
