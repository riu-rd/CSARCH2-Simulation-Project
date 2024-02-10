
window.onload=function(){
    const button = document.querySelector('#submit')
    button.addEventListener('click', main)

    const output = document.querySelector('.output')
    const step = document.querySelector('.step')
    
    function clear_output() {
        while(output.firstChild) 
        {
          output.removeChild(output.lastChild)
        }
        while(step.firstChild) 
        {
          step.removeChild(step.lastChild)
        }
    }

    function decToBin(num) {
        let sign = num.charAt(0);
        let absNum = (sign === '-' || sign === '+') ? num.slice(1) : num;
        let incompleteBin = parseInt(absNum, 10).toString(2);
        let bin = absNum === "32768" ? incompleteBin : "0" + incompleteBin;
        return sign === '-' ? complement(bin) : bin;
    }

    function binToDec(bin) {
        let sign = bin.charAt(0);
        let unsignedBin = sign === '1' ? complement(bin) : bin;
        let dec = parseInt(unsignedBin, 2);
        return sign  === '1' ? -dec : dec;
    }

    function add(num1, num2) {
        let result = ''
        let carry = 0
      
        for (let i = num1.length-1; i > -1; i--) {
            if (num1.charAt(i) == '0' && num2.charAt(i) == '0') {
                if (carry == 1) {
                  result = '1' + result
                  carry = 0
                }
                else {
                  result = '0' + result
                  carry = 0
                }
            }
          
            else if (num1.charAt(i) == '1' && num2.charAt(i) == '1') {
                if (carry == 1) {
                    result = '1' + result
                    carry = 1
                }
                else {
                    result = '0' + result
                    carry = 1
                }
            }
            else {
                if (carry == 1) {
                    result = '0' + result
                    carry = 1
                }
                else {
                    result = '1' + result
                    carry = 0
                }
            }
        }
        return result
      }

    function complement(num){
        let result = ""
        let foundOne = false
        for(let i = num.length-1; i >= 0; i--)
        {
            if(foundOne == false)
            {
                result = num.charAt(i) + result
                if(num.charAt(i) == '1')
                {
                    foundOne = true
                }
            }
            else
            {
                if(num.charAt(i) == '1')
                {
                    result = '0' + result
                }
                else
                {
                    result = '1' + result
                }
            }
        }
        return result
    }

	function convert_booth(num){
		let result = [] //use as a stack
		let lenMinusOne = num.length - 1

		//loop stops at the 2nd bit from the lsb
		for (let i = 0; i < lenMinusOne; i++) {
			//case 00/11
			if ((num.charAt(i) == 0 && num.charAt(i+1) == 0) || (num.charAt(i) == 1 && num.charAt(i+1) == 1)) {
				result.push("0")
			}
			//case 10
			if (num.charAt(i) == 1 && num.charAt(i+1) == 0) {
				result.push("-1")
			}
			//case 01
			if (num.charAt(i) == 0 && num.charAt(i+1) == 1) {
				result.push("+1")
			}
		}

		//final digit + virtual 0
		//case 10
		if (num.charAt(lenMinusOne) == 1) {
			result.push("-1")
		}
		//case 00
		else if (num.charAt(lenMinusOne) == 0) {
			result.push("0")
		}
		return result;
	}

    function convert_booth_extended(num){
        let result = []
        let lenMinusOne = num.length - 1
        let addLen = 0
        
        //if odd number of bits, sign-extend
        if (num.length % 2 != 0) {
            if (num.charAt(0) == 1) {
                num = "1" + num
                addLen++
            }
            else {
                num = "0" + num
                addLen++
            }
        }
        //append 0 at the LSb side
        num = num + "0"
        
        //bit-pairing
        for (let i = 0; i < lenMinusOne+addLen+1; i+=2) {
            //case 000/111
            console.log(num.charAt)
            if ((num.charAt(i) == 0 && num.charAt(i+1) == 0 && num.charAt(i+2) == 0) || (num.charAt(i) == 1 && num.charAt(i+1) == 1 && num.charAt(i+2) == 1)) {
                result.push("0")
            }
            //case 001/010
            if ((num.charAt(i) == 0 && num.charAt(i+1) == 0 && num.charAt(i+2) == 1) || (num.charAt(i) == 0 && num.charAt(i+1) == 1 && num.charAt(i+2) == 0)) {
                result.push("+1")
            }
            //case 011
            if (num.charAt(i) == 0 && num.charAt(i+1) == 1 && num.charAt(i+2) == 1) {
                result.push("+2")
            }
            //case 100
            if (num.charAt(i) == 1 && num.charAt(i+1) == 0 && num.charAt(i+2) == 0) {
                result.push("-2")
            }
            //case 101//110
            if ((num.charAt(i) == 1 && num.charAt(i+1) == 0 && num.charAt(i+2) == 1) || (num.charAt(i) == 1 && num.charAt(i+1) == 1 && num.charAt(i+2) == 0)){
                result.push("-1")
            }
        }
        
        return result;
        
    }

    function zero(num) {
        let result = ""
        for(let i = num.length-1; i >= 0; i--) {
            result = '0' + result
        }
        return result
    }

    function sign_extend(num, bitsNeeded) {
        result = ""
        result = num + result
        for(let i = 0; i < bitsNeeded; i++)
        {
            if(num.charAt(0) == '1')
            {
                result = "1" + result
            }
            else
            {
                result = "0" + result
            }
        }
        return result
    }

    function equalize_bits(m, n) {
        let bitsNeeded = 0
        if(m.length > n.length)
        {
            bitsNeeded = m.length - n.length
            return sign_extend(n, bitsNeeded)
        }
        else {
            bitsNeeded = n.length - m.length
            return sign_extend(m, bitsNeeded)
        }
    }

    function right_extend(num, bitsNeeded) {
        result = ""
        result = num + result
        for(let i = 0; i < bitsNeeded; i++)
        {
            result = result + '0'
        }
        return result
    }

    function get_mult_radio() {
        let radios = document.getElementsByName("mult_type")
        let curRadio = Array.from(radios).find(
        (radio) => radio.checked
        )
        return curRadio.value
    }

    function get_input_radio() {
        let radios = document.getElementsByName("input_type")
        let curRadio = Array.from(radios).find(
            (radio) => radio.checked
        )
        return curRadio.value
    }
        
    function get_output_radio() {
        let radios = document.getElementsByName("output_type")
        let curRadio = Array.from(radios).find(
            (radio) => radio.checked
        )
        return curRadio.value
    }

	function get_output_array_booths(m,n){
        output_array = []
        if(m.length != n.length)
        {
            if(m.length > n.length)
            {
                n = equalize_bits(m,n)
            }
            else
            {
                m = equalize_bits(m,n)
            }
        }
        output_array.push(`<div class = "step">
                                Step 1: represent both multiplicand (m) and multiplier (n) using 2’s
                                complement format <br>
                                m = ${m} <br>
                                n = ${n} <br>
                            </div>`)

        //STEP 2
		booths_n = convert_booth(n)
        booths_string = ""
		booths_n.forEach(x => {booths_string += x})

        output_array.push(`<div class = "step">
                                Step 2: Convert the multiplier to Booth's form<br>
                                - append 0 to the LSb side <br>
                                - pair two bits starting from any side you want <br>
                                - 00 and 11 become 0; 10 becomes -1; 01 becomes +1 <br>
                                ${booths_string}
        </div>`)
                    
		let currIntermediateLength = m.length + n.length
		let mNeg = complement(m)
		let mZero = zero(m)
		let result = sign_extend(mZero, m.length)

        output_array.push(`<div class = "step"> Step 3: Do the usual pen and paper multiplication <br>
        <div class = "step"> 
        ${m}<br>
        ${booths_string}<br>
        ---------------------<br>
        `)

		//forEach backwards
		booths_n.slice().reverse().forEach(i => {
			lengthToExtend = currIntermediateLength - m.length
			if (i == "+1") {
				unextendedInter = sign_extend(m,lengthToExtend) //un-right extended intermediate
				result = add(result, right_extend(unextendedInter, result.length - unextendedInter.length))
                output_array.push(`${sign_extend(m,lengthToExtend)}<br>`)
				currIntermediateLength--
			}
			if (i == "-1") {
				unextendedInter = sign_extend(mNeg,lengthToExtend) //un-right extended intermediate
				result = add(result, right_extend(unextendedInter, result.length - unextendedInter.length))
                output_array.push(`${sign_extend(mNeg,lengthToExtend)}<br>`)
				currIntermediateLength--
			}
			if (i == "0") {
				unextendedInter = sign_extend(mZero,lengthToExtend) //un-right extended intermediate
				result = add(result, right_extend(unextendedInter, result.length - unextendedInter.length))
                output_array.push(`${sign_extend(mZero,lengthToExtend)}<br>`)
				currIntermediateLength--
			}
		})
        resultDec = binToDec(result)
        output_array.push(`---------------------<br>
        ${result} <- Multiplication Result<br>
        ${resultDec} <- Result in Decimal <br>
        </div>
        `)

        return output_array
	}

	function get_booths_file(m,n){
        output_array = []
        if(m.length != n.length)
        {
            if(m.length > n.length)
            {
                n = equalize_bits(m,n)
            }
            else
            {
                m = equalize_bits(m,n)
            }
        }
        output_array.push(`Step 1: represent both multiplicand (m) and multiplier (n) using 2’s complement format
m = ${m}\n
n = ${n}\n`)

        //STEP 2
		booths_n = convert_booth(n)
        booths_string = ""
		booths_n.forEach(x => {booths_string += x})

        output_array.push(`Step 2: Convert the multiplier to Booth's form\n
    - append 0 to the LSb side \n
    - pair two bits starting from any side you want
    - 00 and 11 become 0; 10 becomes -1; 01 becomes +1
Booth's form: ${booths_string}\n`)
                    
		let currIntermediateLength = m.length + n.length
		let mNeg = complement(m)
		let mZero = zero(m)
		let result = sign_extend(mZero, m.length)

        output_array.push(`Step 3: Do the usual pen and paper multiplication\n
${m}
${booths_string}
---------------------`)

		//forEach backwards
		booths_n.slice().reverse().forEach(i => {
			lengthToExtend = currIntermediateLength - m.length
			if (i == "+1") {
				unextendedInter = sign_extend(m,lengthToExtend) //un-right extended intermediate
				result = add(result, right_extend(unextendedInter, result.length - unextendedInter.length))
                output_array.push(`${sign_extend(m,lengthToExtend)}\n`)
				currIntermediateLength--
			}
			if (i == "-1") {
				unextendedInter = sign_extend(mNeg,lengthToExtend) //un-right extended intermediate
				result = add(result, right_extend(unextendedInter, result.length - unextendedInter.length))
                output_array.push(`${sign_extend(mNeg,lengthToExtend)}\n`)
				currIntermediateLength--
			}
			if (i == "0") {
				unextendedInter = sign_extend(mZero,lengthToExtend) //un-right extended intermediate
				result = add(result, right_extend(unextendedInter, result.length - unextendedInter.length))
                output_array.push(`${sign_extend(mZero,lengthToExtend)}\n`)
				currIntermediateLength--
			}
		})
        resultDec = binToDec(result)
        output_array.push(`---------------------
${result} <- Multiplication Result\n
${resultDec} <- Result in Decimal`)

        return output_array
	}

    function get_output_array_extended(m,n){
        output_array = []
        if(m.length != n.length)
        {
            if(m.length > n.length)
            {
                n = equalize_bits(m,n)
            }
            else
            {
                m = equalize_bits(m,n)
            }
        }
        output_array.push(`<div class = "step">
                                Step 1: represent both multiplicand (m) and multiplier (n) using 2’s complement format <br>
                                m = ${m} <br>
                                n = ${n} <br>
                            </div>`)
    
        //STEP 2
        extended_n = convert_booth_extended(n)
        extended_string = ""
        extended_n.forEach(x => {extended_string += x})
    
        output_array.push(`<div class = "step">
                                Step 2: convert multiplier (n) to extended Booth’s format <br>
                                - append 0 at the LSb side <br>
                                - if odd number of bits, sign-extend <br>
                                - bit-pair starting at LSb <br>
                                n = ${extended_string} <br>
                            </div>`)
    
        let currIntermediateLength = m.length + n.length
        let mNeg = complement(m)
        let mZero = zero(m)
        let result = sign_extend(mZero, m.length)
    
        output_array.push(`<div class = "step"> Step 3: Do the usual pen and paper multiplication <br> 
        ${m}<br>
        ${extended_string}<br>
        ---------------------<br>
        </div>`)
    
        //forEach backwards
        extended_n.slice().reverse().forEach(i => {
            lengthToExtend = currIntermediateLength - m.length
            if (i == "+1") {
                unextendedInter = sign_extend(m,lengthToExtend) //un-right extended intermediate
                result = add(result, right_extend(unextendedInter, result.length - unextendedInter.length))
                output_array.push(`${sign_extend(m,lengthToExtend)}<br>`)
                currIntermediateLength-=2
            }
            if (i == "-1") {
                unextendedInter = sign_extend(mNeg,lengthToExtend) //un-right extended intermediate
                result = add(result, right_extend(unextendedInter, result.length - unextendedInter.length))
                output_array.push(`${sign_extend(mNeg,lengthToExtend)}<br>`)
                currIntermediateLength-=2
            }
            if (i == "0") {
                unextendedInter = sign_extend(mZero,lengthToExtend) //un-right extended intermediate
                result = add(result, right_extend(unextendedInter, result.length - unextendedInter.length))
                output_array.push(`${sign_extend(mZero,lengthToExtend)}<br>`)
                currIntermediateLength-=2
            }
            if (i =="+2") {
                let m2=m+"0"
                unextendedInter = sign_extend(m2,lengthToExtend-1) //un-right extended intermediate
                result = add(result, right_extend(unextendedInter, result.length - unextendedInter.length+1))
                output_array.push(`${sign_extend(m,lengthToExtend-1)}0<br>`)
                currIntermediateLength-=2
            }
            if (i =="-2") {
                let mNeg2=mNeg+"0"
                unextendedInter = sign_extend(mNeg2,lengthToExtend-1) //un-right extended intermediate
                result = add(result, right_extend(unextendedInter, result.length - unextendedInter.length+1))
                output_array.push(`${sign_extend(mNeg,lengthToExtend-1)}0<br>`)
                currIntermediateLength-=2

                console.log(unextendedInter)
                console.log(result)
            }
        })
        resultDec = binToDec(result)
        output_array.push(`<div class = "step">---------------------<br>
        ${result} <-Multiplication Result<br>
        ${resultDec} <- Result in Decimal <br>
        </div>
        `)
    
        return output_array
    }

// a function get_extended_file(m,n)
function get_extended_file(m,n){
    output_array = []
    if(m.length != n.length)
    {
        if(m.length > n.length)
        {
            n = equalize_bits(m,n)
        }
        else
        {
            m = equalize_bits(m,n)
        }
    }
    output_array.push(`Step 1: represent both multiplicand (m) and multiplier (n) using 2’s complement format
m = ${m}
n = ${n}
\n`)

    //STEP 2
    extended_n = convert_booth_extended(n)
    extended_string = ""
    extended_n.forEach(x => {extended_string += x})

    output_array.push(`Step 2: convert multiplier (n) to extended Booth’s format
- append 0 at the LSb side
- if odd number of bits, sign-extend
- bit-pair starting at LSb
n = ${extended_string}
\n`)

    let currIntermediateLength = m.length + n.length
    let mNeg = complement(m)
    let mZero = zero(m)
    let result = sign_extend(mZero, m.length)

    output_array.push(`Step 3: Do the usual pen and paper multiplication
    ${m}
    ${extended_string}
---------------------
`)

    //forEach backwards
    extended_n.slice().reverse().forEach(i => {
        lengthToExtend = currIntermediateLength - m.length
        if (i == "+1") {
            unextendedInter = sign_extend(m,lengthToExtend) //un-right extended intermediate
            result = add(result, right_extend(unextendedInter, result.length - unextendedInter.length))
            output_array.push(`${sign_extend(m,lengthToExtend)}\n`)
            currIntermediateLength-=2
        }
        if (i == "-1") {
            unextendedInter = sign_extend(mNeg,lengthToExtend) //un-right extended intermediate
            result = add(result, right_extend(unextendedInter, result.length - unextendedInter.length))
            output_array.push(`${sign_extend(mNeg,lengthToExtend)}\n`)
            currIntermediateLength-=2
        }
        if (i == "0") {
            unextendedInter = sign_extend(mZero,lengthToExtend) //un-right extended intermediate
            result = add(result, right_extend(unextendedInter, result.length - unextendedInter.length))
            output_array.push(`${sign_extend(mZero,lengthToExtend)}\n`)
            currIntermediateLength-=2
        }
        if (i =="+2") {
            let m2=m+"0"
            unextendedInter = sign_extend(m2,lengthToExtend-1) //un-right extended intermediate
            result = add(result, right_extend(unextendedInter, result.length - unextendedInter.length+1))
            output_array.push(`${sign_extend(m,lengthToExtend-1)}0\n`)
            currIntermediateLength-=2
        }
        if (i =="-2") {
            let mNeg2=mNeg+"0"
            unextendedInter = sign_extend(mNeg2,lengthToExtend-1) //un-right extended intermediate
            result = add(result, right_extend(unextendedInter, result.length - unextendedInter.length+1))
            output_array.push(`${sign_extend(mNeg,lengthToExtend-1)}0\n`)
            currIntermediateLength-=2
        }
    })
resultDec = binToDec(result)
output_array.push(`---------------------
${result} <-Multiplication Result
${resultDec} <- Result in Decimal
`)

    return output_array
}
    
    function get_output_array_pen_paper(m, n){
        const file_out = []
        if(m.length != n.length)
        {
            if(m.length > n.length)
            {
                n = equalize_bits(m,n)
            }
            else
            {
                m = equalize_bits(m,n)
            }
        }
        file_out.push(`<div class = "step">
        Step 1: represent both multiplicand (m) and multiplier (n) using 2’s
        complement format <br>
        m = ${m} <br>
        n = ${n} <br>
        </div>`) 
        let mNeg = complement(m)
        let mZero = zero(m)
        let result = sign_extend(mZero, m.length)
        let intermediateIndex = 0
        let curN = ''
        for(let i = m.length-1; i > -1; i--)
        {
            
            if(intermediateIndex == 0){
                file_out.push(`<div class = "step">
                    Step 2: the first intermediate product has a length of m+n bits. Sign
                    extend as needed <br>
                </div>`)
            }
            curN = ''
            if(n.charAt(i) == '1')
            {
                curN = sign_extend(m,i+1)
                console.log(sign_extend(m,i+1))
                if(intermediateIndex == 1)
                {
                    file_out.push(`<div class = "intermediate">
                                ${curN} <-- Intermediate ${intermediateIndex+1} (Step 3: As with pencil-and-paper multiplication, succeeding
                                intermediate products are shifted left)<br>
                            </div>`)
                }
                else{
                    file_out.push(`<div class = "intermediate">
                                ${curN} <-- Intermediate ${intermediateIndex+1} <br>
                            </div>`)
                }
                result = add(right_extend(curN,intermediateIndex), result)
            }
            else
            {
                
                console.log(sign_extend(mZero,i+1))
                if(intermediateIndex == 1)
                {
                    file_out.push(`<div class = "intermediate">
                                ${sign_extend(mZero,i+1)} <-- Intermediate ${intermediateIndex+1} (Step 3: As with pencil-and-paper multiplication, succeeding
                                intermediate products are shifted left)<br>
                            </div>`)
                }
                else{
                    file_out.push(`<div class = "intermediate">
                                ${sign_extend(mZero,i+1)} <-- Intermediate ${intermediateIndex+1} <br>
                            </div>`)
                }
            }
            intermediateIndex = intermediateIndex + 1
        }
        if(n.charAt(0) == '1')
        {
            if(intermediateIndex == 1)
                {
                    file_out.push(`<div class = "intermediate">
                                ${mNeg} <-- Intermediate ${intermediateIndex+1} 
                                (Step 3: As with pencil-and-paper multiplication, succeeding
                                intermediate products are shifted left) (Step 4: if the multiplier is negative, add the 2’s complement of the
                                    multiplicand, sign-extended and shifted to sign-bit position)<br>
                            </div>`)
                }
                else{
                    file_out.push(`<div class = "intermediate">
                                ${mNeg} <-- Intermediate ${intermediateIndex+1} 
                                (Step 4: if the multiplier is negative, add the 2’s complement of the
                                    multiplicand, sign-extended and shifted to sign-bit position)<br>
                            </div>`)
                }
            result = add(right_extend(mNeg,intermediateIndex), result)
            console.log(mNeg)
        }
        console.log(result)
        resultDec = binToDec(result)
        file_out.push(`<div class = "result">
                            _____________________________________<br>
                                ${result} <- Multiplication Result<br>
                                ${resultDec} <- Result in Decimal <br>
                            </div>`)
        return file_out
    }

    function do_pen_paper_file(m, n){

        const file_out = []
        if(m.length != n.length)
        {
            if(m.length > n.length)
            {
                n = equalize_bits(m,n)
            }
            else
            {
                m = equalize_bits(m,n)
            }
        }
        
        file_out.push(`Step 1: represent both multiplicand (m) and multiplier (n) using 2’s complement format \n`)
        file_out.push(`m = ${m} \n`)
        file_out.push(`n = ${n} \n`)
                            
        let mNeg = complement(m)
        let mZero = zero(m)
        let result = sign_extend(mZero, m.length)
        let intermediateIndex = 0
        let curN = ''
        for(let i = m.length-1; i > -1; i--)
        {
            if(intermediateIndex == 0){
                
                file_out.push( `Step 2: the first intermediate product has a length of m+n bits. Sign
                extend as needed \n`)
                
            }
            curN = ''
            if(n.charAt(i) == '1')
            {
                curN = sign_extend(m,i+1)
                console.log(sign_extend(m,i+1))
                if(intermediateIndex == 1)
                {
                    file_out.push(`${curN} <-- Intermediate ${intermediateIndex+1} (Step 3: As with pencil-and-paper multiplication, succeeding
                        intermediate products are shifted left)\n`)
                                
                }
                else{
                    file_out.push(`${curN} <-- Intermediate ${intermediateIndex+1} \n`)
                }
                result = add(right_extend(curN,intermediateIndex), result)
            }
            else
            {
                
                console.log(sign_extend(mZero,i+1))
                if(intermediateIndex == 1)
                {
                    file_out.push(`${sign_extend(mZero,i+1)} <-- Intermediate ${intermediateIndex+1} (Step 3: As with pencil-and-paper multiplication, succeeding
                        intermediate products are shifted left)\n`)
                }
                else{
                    file_out.push(`${sign_extend(mZero,i+1)} <-- Intermediate ${intermediateIndex+1} \n`)
                                
                            
                }
            }
            intermediateIndex = intermediateIndex + 1
        }
        if(n.charAt(0) == '1')
        {
            if(intermediateIndex == 1)
                {
                    file_out.push(`${mNeg} <-- Intermediate ${intermediateIndex+1} (Step 3: As with pencil-and-paper multiplication, succeeding
                    intermediate products are shifted left) 
                    (Step 4: if the multiplier is negative, add the 2’s complement of the multiplicand, sign-extended and shifted to sign-bit position)\n`)
                }
                else{
                    file_out.push(`${mNeg} <-- Intermediate ${intermediateIndex+1} (Step 4: if the multiplier is negative, add the 2’s complement of the multiplicand, sign-extended and shifted to sign-bit position)\n`)
                }
            result = add(right_extend(mNeg,intermediateIndex), result)
            console.log(mNeg)
        }
        console.log(result)
        resultDec = binToDec(result)
        file_out.push(`_____________________________________\n${result} <- Multiplication Result\n${resultDec} <- Result in Decimal\n`)

        return file_out
                            
                           
    }

    function do_pen_paper_all(mode, m, n){
        let i = 0
        const outputs = mode(m,n)

        while(i < outputs.length){
            output.innerHTML += outputs[i]
            i++
        }
    }


    function removeNextButton(){
        const nextButton = document.querySelector('#next')
        nextButton.remove()
    }

    //where mode is the function
    function do_pen_paper_step_by_step(mode, m, n){
        const outputs = mode(m,n)

         
        let i = 1
        step.innerHTML += '<div><button class="next-button" id="next">Next Step</button></div>'
        const nextButton = document.querySelector('#next')
        output.innerHTML += outputs[0]
        nextButton.addEventListener('click', () => {
            output.innerHTML += outputs[i]
            i++
            if(i == outputs.length){
                removeNextButton()
            }
        })
        
        
        
    }
    
    function display(mode, m, n, output_type, multi_type){
        if(output_type === "All"){
            clear_output()
            do_pen_paper_all(mode, m,n)
        }
        else if (output_type === "Step"){
            clear_output()
            do_pen_paper_step_by_step(mode, m,n)
        }
        else if (output_type === "FileOut" && multi_type === "PenPaper"){
            clear_output()
            output.innerHTML = `
            <div class="outbutton"><a id="a_out" download="result.txt" class="dl">Download File</a></div>
          `
            const file_out = do_pen_paper_file(m,n)
            a_out.href = URL.createObjectURL(new Blob(file_out, { type: 'text/plain'}))
        }
        else if (output_type === "FileOut" && multi_type === "Booth"){
            clear_output()
            output.innerHTML = `
            <div class="outbutton"><a id="a_out" download="result.txt" class="dl">Download File</a></div>
          `
            const file_out = get_booths_file(m,n)
            a_out.href = URL.createObjectURL(new Blob(file_out, { type: 'text/plain'}))
        }
        else if (output_type === 'FileOut' && multi_type === "Extended"){
            clear_output()
            output.innerHTML = `
            <div class="outbutton"><a id="a_out" download="result.txt" class="dl">Download File</a></div>
          `
            const file_out = get_extended_file(m,n)
            a_out.href = URL.createObjectURL(new Blob(file_out, { type: 'text/plain'}))
        }
        
    }

    function penpaperlogtest(m,n){
        if(m.length != n.length)
        {
            if(m.length > n.length)
            {
                n = equalize_bits(m,n)
            }
            else
            {
                m = equalize_bits(m,n)
            }
        }
        let mNeg = complement(m)
        let mZero = zero(m)
        let result = sign_extend(mZero, m.length)
        let intermediateIndex = 0
        let curN = ''
        for(let i = m.length-1; i > -1; i--)
        {
            curN = ''
            if(n.charAt(i) == '1')
            {
                curN = sign_extend(m,i+1)
                console.log(sign_extend(m,i+1))
                result = add(right_extend(curN,intermediateIndex), result)
            }
            else
            {
                console.log(sign_extend(mZero,i+1))
            }
            intermediateIndex = intermediateIndex + 1
        }
        if(n.charAt(0) == '1')
        {
            result = add(right_extend(mNeg,intermediateIndex), result)
            console.log(mNeg)
        }
        console.log(result)
    }

    function errorCheck (m, n, type) {
        let message ="";
        if (m === "" || n === "") {
            message = "Error: Please enter values for both fields.";
            printError(message);
            return false;
        }

        if (type === "Decimal") {
            const num1 = Number(m);
            const num2 = Number(n);
            if (isNaN(num1) || isNaN(num2)) {
                console.log("Invalid Decimal Input!");
                message = "Error: Invalid decimal input.";
                printError(message);
                return false;
              } 
            if((num1 < -32768 || num1 > 32767) || (num2 < -32768 || num2 > 32767)) {
                message = "Error: Decimal input can only be from between -32768 and 32767.";
                printError(message);
                return false;
            }
        }
        else {
            const bin_regex = /^[01]+$/;
            if (!(bin_regex.test(m) && bin_regex.test(n))) {
                console.log("Invalid Binary Input!");
                message = "Error: Invalid binary input."
                printError(message);
                return false;
              } 
            if (m.length > 16 || n.length > 16) {
                message = "Error: Binary input exceeds 16-bit limit."
                printError(message);
                return false;
            }
        }
        return true;
    }

    function printError(message) {
        document.querySelector("p#errorText").innerHTML = message;
        document.querySelector("div.output").innerHTML = "";
        document.querySelector("div.step").innerHTML = "";
    }

    function clearFields() {
        document.querySelector("input#inputM").value = "";
        document.querySelector("input#inputN").value = "";
        document.querySelector("p#errorText").innerHTML = "";
    }

    function main() {
        let multiplicand = document.querySelector("input#inputM").value.trim();
        let multiplier = document.querySelector("input#inputN").value.trim();
        let type_multi = get_mult_radio();
        let type_input = get_input_radio();
        let type_output = get_output_radio();

        if (errorCheck(multiplicand, multiplier, type_input)) {
            console.log("Multiplicand: ", multiplicand);
            console.log("Multiplier: ", multiplier);
            if (type_input === "Decimal") {
                multiplicand = decToBin(multiplicand);
                multiplier = decToBin(multiplier);
                console.log("New Multiplicand: ", multiplicand);
                console.log("New Multiplier: ", multiplier);
            }

            if (type_multi === "PenPaper") {
                display(get_output_array_pen_paper, multiplicand, multiplier, type_output, type_multi);
            }
            else if (type_multi === "Booth") {
                display(get_output_array_booths, multiplicand, multiplier, type_output, type_multi);
            }
            else if (type_multi === "Extended") {
                display(get_output_array_extended, multiplicand, multiplier, type_output, type_multi);
            }
            clearFields();
        }
    }
}
