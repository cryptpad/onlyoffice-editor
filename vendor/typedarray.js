(function(){
	var typed_arrays = [
		Int8Array,
		Uint8Array,
		Int16Array,
		Uint16Array,
		Int32Array,
		Uint32Array,
		Float32Array,
		Float64Array,
		Uint8ClampedArray
	];

	for (var i = 0, len = typed_arrays.length; i < len; i++)
	{
		var typed_array = typed_arrays[i];

		if (!typed_array.prototype.slice)
		{
			typed_array.prototype.slice = function(begin, end)
			{
				var len = this.length;
				var size;
				var start = begin || 0;

				start = (start >= 0) ? start : Math.max(0, len + start);
				end = end || len;

				var up_to = (typeof end == 'number') ? Math.min(end, len) : len;
				if (end < 0) up_to = len + end;

				// actual expected size of the slice
				size = up_to - start;

				// if size is negative it should return an empty array
				if (size <= 0) size = 0;

				var typed_array_constructor = this.constructor;
				var cloned = new typed_array_constructor(size);

				for (var i = 0; i < size; i++) {
					cloned[i] = this[start + i];
				}

				return cloned;
			};
		}

		if (!typed_array.prototype.fill)
		{
			typed_array.prototype.fill = function(value, begin, end)
			{
				var len = this.length;
				var size;
				var start = begin || 0;

				start = (start >= 0) ? start : Math.max(0, len + start);
				end = end || len;

				var up_to = (typeof end == 'number') ? Math.min(end, len) : len;
				if (end < 0) up_to = len + end;

				// actual expected size of the slice
				size = up_to - start;

				// if size is negative it should return an empty array
				if (size <= 0) size = 0;

				for (var i = 0; i < size; i++) {
					this[start + i] = value;
				}

				return this;
			};
		}
	}
})();
