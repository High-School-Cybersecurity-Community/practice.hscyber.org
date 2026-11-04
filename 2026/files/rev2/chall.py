x=[30, 30, 218, 151, 206, 188, 40, 212, 67, 175, 114, 206, 141, 114, 33, 114, 141, 188, 40, 61, 175, 114, 206, 209, 252, 249, 98, 6, 40, 3, 249, 36]

def a(s):
    if len(s) != len(x):
        return False

    for i in range(len(s)):
        if (ord(s[i]) * 37 + 19) % 256 != x[i]:
            return False

    return True

s = input("Serial: ")

if a(s):
    print("Valid!")
else:
    print("Invalid!")
